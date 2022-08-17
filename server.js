const express = require('express');
const PORT = process.env.PORT || 3003;
const app = express();
const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
// const apiRoutes = require('./routes/apiRoutes');

//express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//use api routes
// app.use('/api', apiRoutes);

//Default response for any other request (Not found)
app.use((req, res) => {
    res.status(404).end();
});

//start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});