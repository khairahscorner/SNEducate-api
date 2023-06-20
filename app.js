require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('./config/cors');
const {getBookById} = require('./app/controllers/book.controller');

const authRouter = require('./routes/authroutes')
const port = process.env.PORT || 3000;

app.use(cors);
app.use('/user', authRouter);


app.listen(port, () => {
    console.log("Server is listening")
})
app.get('/books/:id', getBookById);


app.get("/", (req, res) => {
    res.status(200).send("works");
});