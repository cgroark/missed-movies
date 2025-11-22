import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRouter from '../src/routes/movies';
import categoryRouter from '../src/routes/categories';
import serverless from 'serverless-http';

dotenv.config();

const app = express();
const allowedOrigins = [
  'https://missedmovies.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('/*', cors());
app.use(express.json());

app.use('/api/movies', movieRouter);
app.use('/api/categories', categoryRouter);

if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
}

// Vercel serverless export
export const handler = serverless(app);
export default handler;