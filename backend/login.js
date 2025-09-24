import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "project-esg.ch84qkaky60x.ap-southeast-2.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: "qwer1234",
  database: "esg_project", 
  waitForConnections: true,
  connectionLimit: 10,
});

// ✅ 회원 전체 목록 조회
export async function getUsers() {
  const [rows] = await pool.query(
    `SELECT user_id, login_id, name, company_id, gender, position_id, is_active, created_at 
     FROM users 
     ORDER BY user_id DESC`
  );
  return rows;
}

// ✅ 회원 추가 (회원가입)
export async function addUser({
  login_id,
  name,
  password_hash,
  password_confirm_hash,
  company_id,
  gender,
  position_id,
}) {
  const [result] = await pool.query(
    `INSERT INTO users 
      (login_id, name, password_hash, password_confirm_hash, company_id, gender, position_id, is_active, created_at, updated_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
    [
      login_id,
      name,
      password_hash,
      password_confirm_hash,
      company_id,
      gender,
      position_id,
    ]
  );
  return result.insertId; // 새로 생성된 user_id 반환
}
