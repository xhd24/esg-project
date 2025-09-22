import express from 'express';
import mysql from 'mysql2';

const app = express();
app.use(express.json());

// MySQL 연결
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // 본인 MySQL 계정
  password: '비밀번호',
  database: 'esgdb'
});

db.connect((err) => {
  if (err) {
    console.error('DB 연결 실패:', err);
    return;
  }
  console.log('MySQL 연결 성공!');
});

// 회원가입 API
app.post('/api/signup', (req, res) => {
  const { username, email, password, company, category, gender } = req.body;

  const sql = `INSERT INTO users (username, email, password, company, category, gender) 
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(sql, [username, email, password, company, category, gender], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: '회원가입 실패' });
    }
    res.json({ message: '회원가입 성공!', userId: result.insertId });
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
