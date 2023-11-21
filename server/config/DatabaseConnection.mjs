import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '123456',
    database: 'db_esp32',
});

export default connection;