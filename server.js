
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());

app.get('/average', async (req, res) => {
    const { pair, start, end } = req.query;
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'forex_rates_db',
        password: 'mysql@123'
    });
    const [rows] = await connection.execute(
        'SELECT AVG(conversion_rate) AS average FROM forex_rates WHERE currency_pair = ? AND date BETWEEN ? AND ?',
        [pair, start, end]
    );
    await connection.end();
    res.json(rows[0]);
});

app.get('/closing', async (req, res) => {
    const { pair, date } = req.query;
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'forex_rates_db',
        password: 'mysql@123'
    });
    const [rows] = await connection.execute(
        'SELECT conversion_rate FROM forex_rates WHERE currency_pair = ? AND date = ?',
        [pair, date]
    );
    await connection.end();
    res.json(rows[0]);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});