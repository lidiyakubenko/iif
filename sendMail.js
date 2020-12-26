require('dotenv').config()

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transportOptions = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
};
const transporter = nodemailer.createTransport(smtpTransport(transportOptions));

const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: 'PS5 добавлена в корзину!',
    text: 'Скорее покупай!'
};

transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});