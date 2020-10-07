require('dotenv').config()
module.exports = {
    mongoose :{host:process.env['MONGO_URL'], port:process.env['MONGO_PORT'], dbname:process.env['MONGO_DB_NAME']},
}