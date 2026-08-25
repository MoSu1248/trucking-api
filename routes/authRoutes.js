import express from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const saltRounds = 10;

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Invalid email or password credentials" });
    }

    const user = result.rows[0];
    const storedHashedPassword = user.password;

    const isMatch = await bcrypt.compare(password, storedHashedPassword);

    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Invalid email or password credentials." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      message: "Login successful!",
      token: token,
      user: {
        id: user.id,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login API Error:", err.message);
    res.status(500).json({ error: "Internal server authentication error." });
  }
});

router.post("/coordinator/register", async (req, res) => {
  const {
    email,
    password,
    confirmPassword,
    fname,
    lname,
    phoneNumber,
    role,
    location,
  } = req.body;

  try {
    console.log("ROLE BEING INSERTED:", role);
    const checkResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (checkResult.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "This email is already in use please login" });
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("error hashing password", err);
        } else {
          const result = await pool.query(
            "INSERT INTO users (email, password , first_name ,last_name,phone_number, role , location ) VALUES ($1, $2,$3, $4, $5,$6,$7) RETURNING *",
            [email, hash, fname, lname, phoneNumber, role, location],
          );
        }
      });

      res.status(200).json({
        message: "Login successful!",
      });
    }
  } catch (error) {
    console.error("❌ REGISTRATION API Error:", err.message);
    res.status(500).json({ error: "Internal server authentication error." });
  }
});

export default router;
