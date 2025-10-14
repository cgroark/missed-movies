import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import movieRouter from "./routes/movies";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/movies", movieRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
