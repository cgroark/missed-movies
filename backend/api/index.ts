import express from 'express';
import dotenv from 'dotenv';
import movieRouter from '../src/routes/movies';
import categoryRouter from '../src/routes/categories';

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://missedmovies.vercel.app',
  'https://missed-movies.vercel.app',
  'http://localhost:5173'
];

// Handle CORS for all routes (including OPTIONS preflight)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());

// Root test route
app.get('/', (req, res) => {
  res.send("Backend API is alive");
});

// API routes
app.use('/api/movies', movieRouter);
app.use('/api/categories', categoryRouter);

// Local only
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
}

module.exports = app;
