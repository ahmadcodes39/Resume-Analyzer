import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import resumeRouter from './routes/resume.js';

dotenv.config();

const app = express();

app.use(cors({ 
  origin: "http://localhost:5173", 
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use('/api/resume', resumeRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is running at port ${port}`);
});
