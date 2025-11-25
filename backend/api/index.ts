import express from 'express';
import cors from 'cors';
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

// 1. Preflight middleware (required for Vercel)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

// 2. CORS (normal runtime cors)
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. JSON body parsing
app.use(express.json());

// 4. Routes
app.use('/api/movies', movieRouter);
app.use('/api/categories', categoryRouter);

// 5. Local dev server
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
}

module.exports = app;
