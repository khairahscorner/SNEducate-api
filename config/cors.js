require('dotenv').config();
const cors = require('cors');

const allowedOrigins = [`http://localhost:${process.env.PORT}`]

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
};

module.exports = cors(corsOptions);
