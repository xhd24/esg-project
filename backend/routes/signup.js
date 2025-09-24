import express from "express";
import bcrypt from "bcryptjs"; // bcryptjs로 교체 추천
import db from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      name,
      login_id,
      email,
      password,
      confirmPassword,
      company,
      gender,
      position,
      role,
    } = req.body;

    if (!name || !login_id || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "필수 입력값이 누락되었습니다." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      `INSERT INTO signup_login 
       (name, login_id, email, password_hash, company, gender, position, role) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, login_id, email, hash, company, gender, position, role || "USER"]
    );

    return res.status(201).json({ userId: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "이미 사용 중인 아이디 또는 이메일입니다." });
    }
    console.error("회원가입 실패:", err);
    return res.status(500).json({ error: "서버 오류" });
  }
});

export default router;
