const mysql = require('mysql2');

//connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'coding',
        database: 'employee_tracker'
    },
    // console.log("Connected to the emoployee tracker database.")
);

module.exports = db;