// routes/esg.js
import express from 'express';
import { pool } from '../db.js';
import questionsSource from '../questions.js';

const router = express.Router();

router.use((req, _res, next) => {
  console.log(`[ESG] ${req.method} ${req.originalUrl}`);
  next();
});

/* ============ Auth ============ */
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

/* ============ 질문 목록 (정적 questionsSource 사용) ============ */
router.get('/questions', requireAuth, async (req, res) => {
  const { category } = req.query;

  const pick = (cat) =>
    (questionsSource[cat] || []).map((q) => ({
      id: q.id,
      category: q.category,
      subCategory: q.subCategory || null,   // ✅ subCategory 포함
      text: q.text,
      description: q.description || '',
      options: q.options || ['예', '아니오'],
    }));

  if (!category) {
    const all = ['Environment', 'Social', 'Governance'].flatMap(pick);
    return res.json({ questions: all });
  }
  return res.json({ questions: pick(category) });
});

/* ============ 내 응답 조회 (최신 1건을 map으로 반환) ============ */
router.get('/answers/me', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { category } = req.query;

  const [rows] = await pool.query(
    `SELECT answerjson
     FROM esg_user_answer
     WHERE user_id = ?
     ORDER BY inputdate DESC
     LIMIT 1`,
    [userId]
  );

  const map = {};
  if (!rows.length) return res.json({ answers: map });

  try {
    // 저장 형식: { submitted_at, answers: [...] }
    const payload = typeof rows[0].answerjson === 'string'
      ? JSON.parse(rows[0].answerjson)
      : rows[0].answerjson;

    const items = Array.isArray(payload?.answers) ? payload.answers : [];
    for (const item of items) {
      if (category && item.category !== category) continue;
      map[Number(item.questionid)] = String(item.answer ?? '');
    }
  } catch (e) {
    console.warn('[answers/me] parse error:', e);
  }
  return res.json({ answers: map });
});

/* ============ 일괄 저장 (전체를 한 JSON으로 1레코드 저장) ============ */
/*
 body: {
   answers: [
     { category, subCategory?, questionid, question, answer },
     ...
   ]
 }
*/
router.post('/answers/bulk', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'answers empty' });
    }

    // 정리/검증 (+ subCategory 반영)
    const cleaned = answers
      .map((a) => ({
        category: a.category,
        subCategory: a.subCategory ?? null,           // ✅ 함께 저장
        questionid: Number(a.questionid),
        question: String(a.question || ''),
        answer: String(a.answer || ''),
      }))
      .filter((a) => a.category && Number.isFinite(a.questionid));

    if (cleaned.length === 0) {
      return res.status(400).json({ error: 'no valid answers' });
    }

    const answerjson = {
      submitted_at: new Date().toISOString(),
      answers: cleaned,
    };

    // === 히스토리 유지형(권장): 매 제출 INSERT로 쌓기 ===
    await pool.query(
      `INSERT INTO esg_user_answer (user_id, answerjson, inputdate)
       VALUES (?, ?, NOW())`,
      [userId, JSON.stringify(answerjson)]
    );

    // === (옵션) 1인 1레코드만 유지하고 싶으면 아래 2줄 사용 ===
    // await pool.query(`DELETE FROM esg_user_answer WHERE user_id = ?`, [userId]);
    // await pool.query(`INSERT INTO esg_user_answer (user_id, answerjson, inputdate) VALUES (?, ?, NOW())`, [userId, JSON.stringify(answerjson)]);

    return res.json({ success: true, saved_count: cleaned.length });
  } catch (err) {
    console.error('[answers/bulk] error:', err);
    res.status(500).json({ error: 'Internal error while saving answers' });
  }
});

/* ============ 제출 이력(연도 목록 + 제출 id) ============ */
router.get('/submissions/me', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const [rows] = await pool.query(
    `SELECT id, inputdate, YEAR(inputdate) AS year
     FROM esg_user_answer
     WHERE user_id = ?
     ORDER BY inputdate DESC`,
    [userId]
  );
  res.json({ submissions: rows });
});

/* ============ 카테고리별 집계 ============ */
/*  GET /esg/report/me
    - 최신 1건: (기본)                       /esg/report/me
    - 특정 연도 최신 1건:                    /esg/report/me?year=2024
    - 특정 제출 id(가장 우선):               /esg/report/me?id=123
*/
router.get('/report/me', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const id = req.query.id ? Number(req.query.id) : null;
  const year = req.query.year ? Number(req.query.year) : null;

  let rows;
  if (id) {
    [rows] = await pool.query(
      `SELECT id, answerjson, inputdate
       FROM esg_user_answer
       WHERE user_id = ? AND id = ?
       LIMIT 1`,
      [userId, id]
    );
  } else if (year) {
    [rows] = await pool.query(
      `SELECT id, answerjson, inputdate
       FROM esg_user_answer
       WHERE user_id = ? AND YEAR(inputdate) = ?
       ORDER BY inputdate DESC
       LIMIT 1`,
      [userId, year]
    );
  } else {
    [rows] = await pool.query(
      `SELECT id, answerjson, inputdate
       FROM esg_user_answer
       WHERE user_id = ?
       ORDER BY inputdate DESC
       LIMIT 1`,
      [userId]
    );
  }

  const counters = {
    Environment: { yes: 0, no: 0, total: 0 },
    Social: { yes: 0, no: 0, total: 0 },
    Governance: { yes: 0, no: 0, total: 0 },
  };

  let savedAt = null;

  if (rows.length) {
    try {
      const payload = typeof rows[0].answerjson === 'string'
        ? JSON.parse(rows[0].answerjson)
        : rows[0].answerjson;

      const items = Array.isArray(payload?.answers) ? payload.answers : [];
      for (const item of items) {
        if (!counters[item.category]) continue;
        counters[item.category].total += 1;
        if (item.answer === '예') counters[item.category].yes += 1;
        else if (item.answer === '아니오') counters[item.category].no += 1;
      }
      savedAt = rows[0].inputdate;
    } catch (e) {
      console.warn('[report/me] parse error:', e);
    }
  }

  const report = ['Environment', 'Social', 'Governance'].map((cat) => ({
    category: cat,
    yes: counters[cat].yes,
    no: counters[cat].no,
    total: counters[cat].total,
  }));

  res.json({ report, savedAt });
});

export default router;
