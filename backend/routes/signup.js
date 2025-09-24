import express from "express";
import bcrypt from "bcryptjs";
import { pool } from "../login.js"; // DB 연결 풀 import

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
      department,
      role,
    } = req.body;

    // ✅ 필수 입력값 검증
    if (!name || !login_id || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "필수 입력값이 누락되었습니다." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
    }

    // ✅ 비밀번호 해싱
    const hash = await bcrypt.hash(password, 10);

    // ✅ DB 저장
    const [result] = await pool.execute(
      `INSERT INTO signup_login 
       (name, login_id, email, password_hash, password_confirm_hash, company, gender, position, department, role, is_active, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [
        name,
        login_id,
        email,
        hash,
        hash, // password_confirm_hash → DB 구조상 있으니 동일하게 저장
        company,
        gender,
        position,
        department,
        role || "USER",
      ]
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
