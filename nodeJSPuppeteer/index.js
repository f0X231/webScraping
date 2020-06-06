const puppeteer = require('puppeteer');
const IMDB_URL = (movie_id) => `https://www.imdb.com/title/${movie_id}/`;
const MOVIE_ID = 'tt6763664';

const loginGithub = async (page) => {
    const USER = {username: "", password: ""}

    // dom element selectors
    const USERNAME_SELECTOR = '#login_field';
    const PASSWORD_SELECTOR = '#password';
    const BUTTON_SELECTOR = '#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block';

    await page.focus(USERNAME_SELECTOR);
    await page.keyboard.type(USER.username);

    await page.focus(PASSWORD_SELECTOR);
    await page.keyboard.type(USER.password);

    await page.click(BUTTON_SELECTOR);

    await page.waitForNavigation();
}

const screenshotWebPage = async (PAGE_URL, SAVE_PATH) => {
    // https://github.com
    // screenshots/github.png
    const browser = await  puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(PAGE_URL);
    await page.screenshot({path: SAVE_PATH });

    await loginGithub(page);
    await page.screenshot({path: __dirname+'/LOGIN.png'});

    browser.close();
}

const getIMDBData = async () => {
    /* Initiate the Puppeteer browser */
    /* โดยปกติแล้ว puppeteer จะรันโหมด headless เป็นค่าเริ่มต้น แต่ถ้าต้องการดู browser ด้วย */
    /* {headless: false} */
    const browser = await  puppeteer.launch();
    const page = await browser.newPage();

    /* Go to the IMDB Movie page and wait for it to load */
    await page.goto(IMDB_URL(MOVIE_ID), { waitUntil: 'networkidle0' });

    /* Run javascript inside of the page */
    let data = await page.evaluate( () => {
        let title = document.querySelector('div[class="title_wrapper"] > h1').innerText;
        let rating = document.querySelector('span[itemprop="ratingValue"]').innerText;
        let ratingCount = document.querySelector('span[itemprop="ratingCount"]').innerText;
        
        return {title, rating, ratingCount}
    });

    console.log(data);
    await browser.close();
};

getIMDBData();
//screenshotWebPage('https://github.com/login', __dirname+'/github.png');
