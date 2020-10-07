const express = require("express");
const expressApp = express();

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: false }));

function extractParams(req){
  return Object.assign({}, req.body, req.query, req.params);
}

function extractActor(req){
  let auth = req.headers.authorization
  if(!auth || !auth.includes('Basic')) return null
  let email = Buffer.from(auth.substr(6),'base64').toString('utf8').split(':')[0]
  return {email}
}

const errorHandler = (mapper) => async (error, req, res, next) => {
  let {status, data} = mapper.present(error)
  console.log(`Error in endpoint ${req.method} ${req.originalUrl} : ${status}`,data)
  res.status(status).json(data);
}

const responseHandler = (mapper) => async (req, res) => {
  let {status, data} = mapper.present(req.results)
  res.status(status).json(data);
}

const endpoint = (uoc) => async (req, res, next) => {
  try {
    let actor = extractActor(req)
    let params = extractParams(req)
    req.results = await uoc(actor)(params)
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = (routes = [], responseMapper, errorMapper, port) => {
  routes.forEach(({path, verb, uoc})=>{
    expressApp[verb.toLowerCase()](path,[endpoint(uoc),responseHandler(responseMapper), errorHandler(errorMapper)])
  })

  expressApp.listen(port)
  console.log(`express running on port ${port}`)
  return expressApp
};