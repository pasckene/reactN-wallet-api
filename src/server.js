import express from 'express';
import dotenv from 'dotenv';
import rateLimiter from './mddleware/rateLimiter.js';
import transactionsRoute from "./routes/transactionsRoute.js";
import { initDB } from "./config/db.js";

import job from "./config/cron.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV === "production") job.start();


// Middleware to parse JSON bodies and handle rate limiting
app.use(express.json()); // Middleware to parse JSON bodies
app.use(rateLimiter); // Apply rate limiting middleware


app.get('/', (req, res) => {
  res.send('Hello World!'); 
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is up and running on PORT:", PORT);
  });
});

