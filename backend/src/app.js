require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('express-async-errors');

const app = express();

app.use(cors());
app.use(express.json());

// Basic healthcheck route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TourneyBeach API is running' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;
