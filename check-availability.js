const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(100000);

    const checkButton = async () => {
        console.log('Проверяем кнопку')
        const container = await page.$('.o-pay__content')
        const buttons = await container.$$eval(
            '.add-to-basket-button',
            nodes => nodes.map(n => n.getAttribute("value")).filter(v => v === 'Добавить в корзину')
        )

        console.log(buttons)

        if (buttons.length) {
            console.log('Есть кнопка!')
            // как только появится кнопка отправить письмо на почту...
            return true
        }
        console.log('Кнопки нет :(')
        return false
    }

    let result

    while (!result) {
        await (async () => {

            console.log('Заходим на пс5 диджитал')
            await page.goto('https://www.mvideo.ru/products/igrovaya-konsol-sony-playstation-5-digital-edition-40074203');
            await page.screenshot({path: 'ps5-digital.png', fullPage: true});

            result = await checkButton()

            console.log('Заходим на пс5 версию с дисководом')
            await page.goto('https://www.mvideo.ru/products/igrovaya-konsol-sony-playstation-5-40073270')
            await page.screenshot({path: 'ps5.png', fullPage: true});

            result = await checkButton()

            // console.log('Заходим на какой-то смартфон')
            // await page.goto('https://www.mvideo.ru/products/smartfon-apple-iphone-12-128gb-green-mgjf3ru-a-30052894')
            // await page.screenshot({path: 'phone.png', fullPage: true});
            //
            // result = await checkButton()
        })();
    }

    await browser.close();

})()