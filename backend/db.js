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

//c1-1 작성
export async function inputC1Query(userId, ioType, shipKey, startDate, endDate, step1, step2, step3, step4, step5) {
  await pool.query(
    "INSERT INTO ci (user_id,io_type,ship_id,start_date,end_date,out_step1,out_step2,out_step3,out_step4,out_step5) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [userId, ioType, shipKey, startDate, endDate, step1, step2, step3, step4, step5]
  );
}

//c1-2 작성
export async function inputC1_1Query(userId, ioType, shipKey, startDate, endDate, step1, step2, step3, step4, step5, step6, step7, step8) {
  await pool.query(
    "INSERT INTO ci (user_id,io_type,ship_id,start_date,end_date,in_step1,in_step2,in_step3,in_step4,in_step5,in_step6,in_step7,in_step8) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [userId, ioType, shipKey, startDate, endDate, step1, step2, step3, step4, step5, step6, step7, step8]
  );
}

export async function getCarbonQuery() {
  const [rows] = await pool.query(
    "SELECT * FROM ci ORDER BY ci_id DESC"
  );
  return rows;
}

export async function getCarbonQuery2() {
  const [rows] = await pool.query(
    "SELECT * FROM cii ORDER BY cii_id DESC"
  );
  return rows;
}
