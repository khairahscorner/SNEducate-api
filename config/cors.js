require('dotenv').config();
const cors = require('cors');

const allowedOrigins = [
  `http://localhost:${process.env.PORT}`,
  process.env.PROD_API_URL,
  process.env.PROD_FRONTEND_URL,
  process.env.FRONTEND_URL
]

const corsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

module.exports = cors(corsOptions);
