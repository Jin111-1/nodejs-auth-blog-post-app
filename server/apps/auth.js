import { Router } from "express";
import bcrypt from "bcrypt";
import { db } from "../utils/db.js";
import jwt from "jsonwebtoken";
const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post("/register", async (req, res) => {
    try {
        const { username, password, firstName, lastName } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = {
            username,
            password: hashedPassword,
            firstName,
            lastName
        };
        
        const collection = db.collection("users");
        await collection.insertOne(newUser);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

authRouter.post('/login', async (req, res) => {
  try {
    const user = await db.collection('users').findOne({
      username: req.body.username,
    })

    if (!user) {
      return res.status(404).json({
        message: 'user not found',
      })
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    )

    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid username or password',
      })
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '1h',
      }
    )

    return res.status(201).json({
      message: 'login successfully',
      token: token,
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})


export default authRouter;

