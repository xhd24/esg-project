import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: "project-esg.ch84qkaky60x.ap-southeast-2.rds.amazonaws.com",
  user: "admin",
  password: "qwer1234",
  database: "esg_project",
  waitForConnections: true,
  connectionLimit: 10,
});

export async function getQueryHx(userId) {
  const [rows] = await pool.query(
    "SELECT category, inquiry_title, inquiry_date FROM faq WHERE requester=? ORDER BY faq_id DESC", [userId]
  );
  return rows;
}

export async function getQueryHxAll() {
  const [rows] = await pool.query(
    "SELECT * FROM faq ORDER BY faq_id DESC"
  );
  return rows;
}

export async function getQueryDetail(faqId) {
  const [rows] = await pool.query(
    "SELECT * FROM faq WHERE faq_id=? ORDER BY faq_id DESC", [faqId]
  );
  return rows;
}

export async function addQuery(inquiry_title, requester, company, email, category, content) {
  await pool.query(
    "INSERT INTO faq (inquiry_title, requester,company,email, category, content) VALUES (?, ?, ?, ?,?,?)",
    [inquiry_title, requester, company, email, category, content]
  );
}