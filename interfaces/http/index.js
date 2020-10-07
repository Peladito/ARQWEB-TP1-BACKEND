const server = require('./express')
const {results, errors} = require('./presenters')
module.exports = (uoc,{port}) => {
    const routes = require('./routes')(uoc)
    return server(routes, results, errors, port)
}
