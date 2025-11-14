import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRouter from './routes/movies';
import categoryRouter from './routes/categories';

dotenv.config?.();
console.log("Serverless function loaded backend src 8");

const app = express();
app.use(cors());
app.use(express.json());
console.log("Serverless function loaded backend src 13");

app.use('/movies', movieRouter);
app.use('/categories', categoryRouter);
console.log("Serverless function loaded backend src 17");


const PORT = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'production') {
  console.log('reached dev port')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
console.log("Serverless function loaded backend src 25");


export default app;
