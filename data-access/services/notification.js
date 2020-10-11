const nodemailer = require('nodemailer');
const fs = require('fs')
const sendWarningMail = ({mailing}) => async recipients => {
    let transporter = nodemailer.createTransport(mailing.smtp)
    let mailOptions = {
        from: '#YoEstuveAhi', 
        to:'warnings@yoestuveahi.com',
        bcc: recipients.join(','), 
        subject: 'Posible contagio detectado', 
        text: null,
        html: fs.readFileSync('./data-access/services/infected.html') 
    };

    await transporter.sendMail(mailOptions)
}

module.exports = dependencies =>( {sendWarningMail: sendWarningMail(dependencies)} )