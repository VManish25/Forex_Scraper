Forex Rate Scraper
Overview
This project consists of a Forex rate scraper that collects currency conversion rates using Puppeteer and stores them in a MySQL database. It also includes a simple Express server that provides endpoints to retrieve average conversion rates and closing rates for specified currency pairs.

Features
Scrapes Forex conversion rates from XE.com.
Stores the scraped rates in a MySQL database.
Provides an API to access average and closing conversion rates.
Requirements
Node.js
MySQL
Puppeteer
Setup
1. Clone the repository
Copy code
git clone <https://github.com/VManish25/Forex_Scraper.git>
cd forex-scraper
2. Install dependencies
npm install
3. Set up MySQL database
Run the following SQL commands to create the database and table:

sql
CREATE DATABASE forex_rates_db;

USE forex_rates_db;

CREATE TABLE forex_rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    currency_pair VARCHAR(10) NOT NULL,
    conversion_rate DECIMAL(10, 6) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_currency_date ON forex_rates (currency_pair, date);
4. Update database credentials
In both server.js and scraper.js, update the MySQL connection details if necessary:

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'forex_rates_db',
    password: 'mysql@123'
});
5. Run the server
To start the Express server:

npm start
The server will be running on http://localhost:3000.

6. Run the scraper
To manually run the scraper (or let it run on a schedule):

npm run scraper
7. Cron Job
The scraper is scheduled to run daily at 6 AM. Ensure your server environment supports cron jobs to keep it running.

API Endpoints
1. Get Average Conversion Rate
Endpoint: /average
Method: GET
Query Parameters:
pair: Currency pair (e.g., USD_INR)
start: Start date in YYYY-MM-DD format
end: End date in YYYY-MM-DD format
Example:

sql
GET http://localhost:3000/average?pair=USD_INR&start=2024-01-01&end=2024-10-01
2. Get Closing Conversion Rate
Endpoint: /closing
Method: GET
Query Parameters:
pair: Currency pair (e.g., USD_INR)
date: Date in YYYY-MM-DD format
Example:


GET http://localhost:3000/closing?pair=USD_INR&date=2024-10-01


Acknowledgments
Puppeteer for headless browser automation.
Express for building the API.
MySQL for the database management.
