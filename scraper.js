
const puppeteer = require('puppeteer');
const mysql = require('mysql2/promise');
const cron = require('node-cron');

const currencyPairs = [
    { from: 'USD', to: 'INR' },
    { from: 'EUR', to: 'USD' },
    { from: 'GBP', to: 'USD' },
    { from: 'AUD', to: 'USD' },
    { from: 'CAD', to: 'USD' },
    
];

async function scrapeForexRates() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const rates = {};

    for (const { from, to } of currencyPairs) {
        const url = `https://www.xe.com/currencyconverter/convert/?Amount=1&From=${from}&To=${to}`;
        await page.goto(url);

        const rate = await page.evaluate(() => {
            const rateElement = document.querySelector('.result__BigRate-sc-1bsijpp-1');
            return rateElement ? rateElement.innerText : null;
        });

        if (rate) {
            rates[`${from}_${to}`] = parseFloat(rate.replace(/,/g,''));
        }
    }

    await browser.close();
    return rates;
}

async function storeRates(rates) {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'forex_rates_db',
        password: 'mysql@123'
    });

    const today = new Date().toISOString().split('T')[0];

    for (const [pair, rate] of Object.entries(rates)) {
        await connection.execute('INSERT INTO forex_rates (currency_pair, conversion_rate, date) VALUES (?, ?, ?)', [pair, rate, today]);
    }

    await connection.end();
}

// Schedule the scraper to run daily at 6 AM
cron.schedule('0 6 * * *', async () => {
    try {
        const rates = await scrapeForexRates();
        await storeRates(rates);
        console.log('Forex rates scraped and stored successfully:', rates);
    } catch (error) {
        console.error('Error scraping forex rates:', error);
    }
});

module.exports = { scrapeForexRates, storeRates };
