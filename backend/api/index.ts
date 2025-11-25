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
  'https://missed-movies.vercel.app',
  'http://localhost:5173'
];

app.get('/', (req, res) => {
  console.log("Root route hit");
  res.send("Backend API is alive");
});

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/movies', movieRouter);
app.use('/categories', categoryRouter);

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
}
console.log("Serverless function loaded");

export default serverless(app);