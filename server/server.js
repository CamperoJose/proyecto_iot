const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000; // Set your desired port number

app.use(express.json()); // Enable JSON parsing for request bodies

const dbConfig = {
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: '123456',
  database: 'db_esp32',
};

const db = mysql.createConnection(dbConfig);

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.post('/temperature', (req, res) => {
  const temperature = req.query.temperature;

  if (!temperature) {
    return res.status(400).send('Temperature is not set in the request body');
  }

  const sql = `INSERT INTO tbl_temp (temp_value) VALUES (${temperature})`;

  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      return res.status(500).send('Internal Server Error');
    }

    console.log('New record created successfully');
    res.send('New record created successfully');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
