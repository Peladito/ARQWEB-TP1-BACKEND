const express = require("express");
const expressApp = express();
const multer  = require('multer')
const cors = require('cors')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './storage')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage })

expressApp.use(express.json());
expressApp.use(cors())
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use('/images',express.static('./storage'));
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
    expressApp[verb.toLowerCase()](path,[upload.array('images'), endpoint(uoc),responseHandler(responseMapper), errorHandler(errorMapper)])
  })

  expressApp.listen(port)
  console.log(`express running on port ${port}`)
  return expressApp
};