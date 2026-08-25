import express from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get("/", (req, res) => {
  res.json({ status: "success", message: "Server is healthy and running!" });
});

app.listen(PORT, () => {
  console.log(`API Machine running on http://localhost:${PORT}`);
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("PostgreSQL Database Connection Failed:", err.message);
  } else {
    console.log("PostgreSQL Connected Successfully at:", res.rows[0].now);
  }
});
