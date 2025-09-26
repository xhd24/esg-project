// routes/esg.js
import express from 'express';
import { pool } from '../db.js';
import questionsSource from '../questions.js'; // ✅ 한 번만 import

const router = express.Router();

router.use((req, _res, next) => {
  console.log(`[ESG] ${req.method} ${req.originalUrl}`);
  next();
});

// ----- Auth helpers -----
function parseBearer(req) {
  const h = req.headers.authorization || '';
  const m = h.match(/^Bearer\s+(\S+)$/i);
  return m ? m[1] : null;
}

async function requireAuth(req, res, next) {
  try {
    const token = parseBearer(req);
    const userKey = Number(token);
    if (!userKey || Number.isNaN(userKey)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const [u] = await pool.query(
      'SELECT user_id FROM signup_login WHERE user_id = ? LIMIT 1',
      [userKey]
    );
    if (!u.length) return res.status(401).json({ error: 'Unauthorized' });
    req.user = { id: userKey };
    next();
  } catch (e) {
    console.error('[Auth] error:', e);
    res.status(500).json({ error: 'Auth resolve error' });
  }
}

// ----- 질문 목록 -----
router.get('/questions', requireAuth, async (req, res) => {
  const { category } = req.query;
  let sql = `SELECT id, category, text, description, options FROM esg_questions`;
  const params = [];
  if (category) {
    sql += ` WHERE category = ?`;
    params.push(category);
  }
  sql += ` ORDER BY id ASC`;

  const [rows] = await pool.query(sql, params);
  const normalized = rows.map(r => ({
    id: r.id,
    category: r.category,
    text: r.text,
    description: r.description,
    options: (() => {
      try { return JSON.parse(r.options); } catch { return ['예', '아니오']; }
    })(),
  }));
  res.json({ questions: normalized });
});

// ----- 내 응답 조회 -----
router.get('/answers/me', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { category } = req.query;

  let sql = `
    SELECT a.question_id, a.selected_option
    FROM esg_user_answers a
    JOIN esg_questions q ON q.id = a.question_id
    WHERE a.user_id = ?
  `;
  const params = [userId];
  if (category) { sql += ` AND q.category = ?`; params.push(category); }
  sql += ` ORDER BY a.question_id ASC`;

  const [rows] = await pool.query(sql, params);
  const map = {};
  rows.forEach(r => { map[r.question_id] = r.selected_option; });
  res.json({ answers: map });
});

// ----- 일괄 저장(업서트) -----
router.post('/answers/bulk', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { answers } = req.body; // [{question_id, selected_option}]

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'answers empty' });
    }

    const now = new Date();
    const values = answers.map(a => [
      a.question_id, userId, a.selected_option, now
    ]);

    const sql = `
      INSERT INTO esg_user_answers (question_id, user_id, selected_option, noted_at)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        selected_option = VALUES(selected_option),
        noted_at = VALUES(noted_at)
    `;

    const [result] = await pool.query(sql, [values]);
    res.json({ success: true, affected: result.affectedRows });
  } catch (err) {
    console.error('[answers/bulk] error:', err);
    res.status(500).json({ error: 'Internal error while saving answers' });
  }
});

// ----- 카테고리별 집계 -----
router.get('/report/me', requireAuth, async (req, res) => {
  const userId = req.user.id;

  const [rows] = await pool.query(`
    SELECT q.category,
           SUM(CASE WHEN a.selected_option = '예' THEN 1 ELSE 0 END) AS yes_count,
           SUM(CASE WHEN a.selected_option = '아니오' THEN 1 ELSE 0 END) AS no_count,
           COUNT(a.question_id) AS answered
    FROM esg_questions q
    LEFT JOIN esg_user_answers a
      ON a.question_id = q.id AND a.user_id = ?
    GROUP BY q.category
    ORDER BY FIELD(q.category, 'Environment','Social','Governance')
  `, [userId]);

  const [totalsRows] = await pool.query(`
    SELECT category, COUNT(*) AS total
    FROM esg_questions
    GROUP BY category
  `);

  const totals = Object.fromEntries(totalsRows.map(r => [r.category, r.total]));
  const report = rows.map(r => ({
    category: r.category,
    yes: Number(r.yes_count || 0),
    no: Number(r.no_count || 0),
    total: totals[r.category] || 0,
  }));

  res.json({ report });
});

// ----- (관리용) 질문 시드 -----
router.post('/admin/seed-questions', requireAuth, async (req, res) => {
  try {
    const [cnt] = await pool.query('SELECT COUNT(*) AS c FROM esg_questions');
    if (cnt[0].c > 0) {
      return res.json({ ok: true, message: 'Already seeded', inserted: 0 });
    }

    const rows = [];
    for (const cat of ['Environment', 'Social', 'Governance']) {
      for (const q of (questionsSource[cat] || [])) {
        rows.push([
          q.id,
          q.category,
          q.text,
          q.description || '',
          JSON.stringify(q.options || ['예','아니오']),
        ]);
      }
    }

    await pool.query(
      `INSERT INTO esg_questions (id, category, text, description, options) VALUES ?`,
      [rows]
    );

    res.json({ ok: true, message: 'Seeded', inserted: rows.length });
  } catch (e) {
    console.error('[seed-questions] error:', e);
    res.status(500).json({ ok: false, error: 'Seed failed' });
  }
});

export default router;
