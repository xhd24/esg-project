import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bodyParser from "body-parser";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ DB 연결 풀
const pool = mysql.createPool({
  host: "localhost",
  user: "root",         // 본인 MySQL 사용자명
  password: "0000", // 본인 MySQL 비밀번호
  database: "esg_app_single",
});

// ✅ 회원가입 API
app.post("/api/signup", async (req, res) => {
  try {
    const {
      username,
      email,
      name,
      password,
      confirmPassword,
      company,
      category,
      gender,
      position,
      department,
    } = req.body;

    // 비밀번호 해시
    const password_hash = crypto.createHash("sha256").update(password).digest("hex");
    const password_confirm_hash = crypto.createHash("sha256").update(confirmPassword).digest("hex");

    const sql = `
      INSERT INTO users (
        login_id, email, full_name, password_hash, password_confirm_hash,
        company_name, category, gender, position, department
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      username,
      email,
      name,
      password_hash,
      password_confirm_hash,
      company,
      category,
      gender,
      position,
      department,
    ]);

    res.json({ success: true, userId: result.insertId });
  } catch (err) {
    console.error("회원가입 오류:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ 로그인 API
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1) 입력 비밀번호 해시
    const password_hash = crypto.createHash("sha256").update(password).digest("hex");

    // 2) DB에서 사용자 찾기
    const [rows] = await pool.query(
      "SELECT user_id, login_id, email, full_name, password_hash FROM users WHERE login_id = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: "존재하지 않는 아이디입니다." });
    }

    const user = rows[0];

    // 3) 비밀번호 확인
    if (user.password_hash !== password_hash) {
      return res.status(401).json({ success: false, error: "비밀번호가 일치하지 않습니다." });
    }

    // 4) 로그인 성공
    res.json({
      success: true,
      message: "로그인 성공",
      user: {
        id: user.user_id,
        username: user.login_id,
        email: user.email,
        full_name: user.full_name,
      },
    });
  } catch (err) {
    console.error("로그인 오류:", err.message);
    res.status(500).json({ success: false, error: "서버 오류" });
  }
});

// ✅ 유저 목록 조회 API
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT user_id, login_id, email, full_name, company_name, category, gender, position, department, created_at FROM users"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ 서버 실행
app.listen(5000, () => console.log("✅ 서버 실행: http://localhost:5000"));
