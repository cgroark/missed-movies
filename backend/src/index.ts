import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRouter from './routes/movies';
import categoryRouter from './routes/categories'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/movies', movieRouter);
app.use('/api/categories', categoryRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
