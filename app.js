require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('./config/cors');
const connection = require('./app/middleware/database');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const allRoutes = require('./routes/routes')
const port = process.env.PORT || 3000;

app.use(cors);
connection();
app.use('/api', allRoutes);

app.listen(port, () => {
    console.log("Server is listening")
})

app.get("/", (req, res) => {
    res.status(200).json({
        message: "SNEducate API"
    });
});