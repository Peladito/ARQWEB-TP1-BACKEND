require('dotenv').config()
module.exports = {
    mongoose :{host:process.env['MONGO_URL'], port:process.env['MONGO_PORT'], dbname:process.env['MONGO_DB_NAME']},
    mailing: {
        smtp:{
            host:process.env['SMTP_HOST'],
            port:process.env['SMTP_PPORT'],
            secure:false,
            auth:{
                user:process.env['SMTP_USER'],
                pass:process.env['SMTP_PASSWORD']
            }
        }
    }
}