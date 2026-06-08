const express = require('express');
const cors = require('cors');
const CryptoJS = require('crypto-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

const API_KEY = process.env.REACT_APP_HOTELBEDS_API_KEY;
const SECRET = process.env.REACT_APP_HOTELBEDS_SECRET;
const BASE_URL = 'https://api.test.hotelbeds.com';

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

function generateSignature() {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  return CryptoJS.SHA256(API_KEY + SECRET + timestamp).toString(CryptoJS.enc.Hex);
}

function hotelbedsHeaders() {
  return {
    'Api-key': API_KEY,
    'X-Signature': generateSignature(),
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
}

// POST /api/hotels/search
app.post('/api/hotels/search', async (req, res) => {
  const { from = 1, to = 20, ...body } = req.query;
  try {
    const response = await fetch(
      `${BASE_URL}/hotel-api/1.0/hotels?from=${from}&to=${to}`,
      {
        method: 'POST',
        headers: hotelbedsHeaders(),
        body: JSON.stringify(req.body),
      }
    );
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    console.error('Hotelbeds search error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/hotels/content
app.get('/api/hotels/content', async (req, res) => {
  const { codes } = req.query;
  try {
    const response = await fetch(
      `${BASE_URL}/hotel-content-api/1.0/hotels?codes=${codes}&language=ENG&from=1&to=20&fields=all`,
      { headers: hotelbedsHeaders() }
    );
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/status  — health check
app.get('/api/status', async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/hotel-api/1.0/status`, {
      headers: hotelbedsHeaders(),
    });
    const data = await response.json();
    res.json({ ok: response.ok, ...data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running at http://localhost:${PORT}`);
  console.log(`   API Key loaded: ${API_KEY ? API_KEY.substring(0, 8) + '...' : '❌ MISSING'}`);

  app.get('/', (req, res) => {
    res.send('Backend is running 🚀');
  });
});
