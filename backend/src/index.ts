import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRouter from './routes/movies';
import categoryRouter from './routes/categories';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/movies', movieRouter);
app.use('/categories', categoryRouter);

const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'production') {
  console.log('reached dev port')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
