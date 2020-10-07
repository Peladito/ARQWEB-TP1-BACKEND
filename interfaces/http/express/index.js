const express = require("express");
const expressApp = express();

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: false }));

function extractParams(req){
  return Object.assign({}, req.body, req.query, req.params);
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
    req.results = await uoc(extractParams(req))
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