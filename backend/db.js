import mysql from 'mysql2/promise';


//db pool
export const pool = mysql.createPool({
  host: "project-esg.ch84qkaky60x.ap-southeast-2.rds.amazonaws.com",
  user: "admin",
  password: "qwer1234",
  database: "esg_project",
  waitForConnections: true,
  connectionLimit: 10,
});


//로그인
export async function getUser(id) {
  const [rows] = await pool.query(
    'SELECT * FROM signup_login WHERE login_id=?'
    , [id]
  );
  return rows[0]
}

//faq 목록 조회
export async function getQueryHx(userId) {
  const [rows] = await pool.query(
    "SELECT category, inquiry_title, inquiry_date FROM faq WHERE requester=? ORDER BY faq_id DESC", [userId]
  [userId]
  );
  return rows;
}

//faq 목록 조회 - 관리자
export async function getQueryHxAll() {
  const [rows] = await pool.query(
    "SELECT * FROM faq ORDER BY faq_id DESC"
  );
  return rows;
}

//faq 상세 보기 - 관리자
export async function getQueryDetail(faqId) {
  const [rows] = await pool.query(
    "SELECT * FROM faq WHERE faq_id=? ORDER BY faq_id DESC", [faqId]
  );
  return rows;
}

//faq 작성
export async function addQuery(inquiry_title, requester, company, email, category, content) {
  await pool.query(
    "INSERT INTO faq (inquiry_title, requester,company,email, category, content) VALUES (?, ?, ?, ?,?,?)",
    [inquiry_title, requester, company, email, category, content]
  );
}

