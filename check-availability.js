require('dotenv').config()
const puppeteer = require('puppeteer');
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
    subject: 'PS5 появилась в наличии!',
    text: 'Скорее покупай!'
};

const sendEmail = ({text, subject}) => {
    transporter.sendMail({...mailOptions, text, subject}, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(100000);

    const links = {
        ps5: 'https://www.mvideo.ru/products/igrovaya-konsol-sony-playstation-5-40073270',
        ps5Digital: 'https://www.mvideo.ru/products/igrovaya-konsol-sony-playstation-5-digital-edition-40074203',
        iphone: 'https://www.mvideo.ru/products/smartfon-apple-iphone-12-128gb-green-mgjf3ru-a-30052894'
    }

    const checkButton = async ({link, item}) => {
        console.log('Проверяем кнопку')
        const container = await page.$('.o-pay__content')
        const buttons = await container.$$eval(
            '.add-to-basket-button',
            nodes => nodes.map(n => n.getAttribute("value")).filter(v => v === 'Добавить в корзину')
        )

        console.log(buttons)

        if (buttons.length) {
            console.log('Есть кнопка!')
            sendEmail({text: `ссылка: ${link}`, subject: `${item} появилась в наличии!`})
            // как только появится кнопка отправить письмо на почту...
            return true
        }
        console.log('Кнопки нет :(')
        return false
    }

    let result

    while (!result) {
        console.log('Заходим на пс5 диджитал')
        await page.goto(links.ps5Digital);
        await page.screenshot({path: 'ps5-digital.png', fullPage: true});

        result = await checkButton({link: links.ps5Digital, item: 'PS5 digital edition'})

        console.log('Заходим на пс5 версию с дисководом')
        await page.goto(links.ps5)
        await page.screenshot({path: 'ps5.png', fullPage: true});

        result = await checkButton({link: links.ps5, item: 'PS5 с дисководом'})

        // тест
        // console.log('Заходим на какой-то смартфон')
        // await page.goto(links.iphone)
        // await page.screenshot({path: 'phone.png', fullPage: true});
        //
        // result = await checkButton({link: links.iphone, item: 'Iphone'})
    }

    await browser.close();

})()