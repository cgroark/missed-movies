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
  'http://localhost:5173',
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    // allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/movies', movieRouter);
app.use('/api/categories', categoryRouter);

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
