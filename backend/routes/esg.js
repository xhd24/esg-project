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

/* ============ 질문 목록 ============ */
router.get('/questions', requireAuth, async (req, res) => {
  const { category } = req.query;

  const pick = (cat) =>
    (questionsSource[cat] || []).map((q) => ({
      id: q.id,
      category: q.category,
      subCategory: q.subCategory || null,
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

/* ============ 내 응답 조회 (최신 1건) ============ */
router.get('/answers/me', requireAuth, async (req, res) => {
  try {
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
  } catch (e) {
    console.error('[answers/me] error:', e);
    return res.status(500).json({ error: 'Internal error' });
  }
});

/* ============ 답변 저장 ============ */
router.post('/answers/bulk', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'answers empty' });
    }

    const cleaned = answers
      .map((a) => ({
        category: a.category,
        subCategory: a.subCategory ?? null,
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

    const [result] = await pool.query(
      `INSERT INTO esg_user_answer (user_id, answerjson, inputdate)
       VALUES (?, ?, NOW())`,
      [userId, JSON.stringify(answerjson)]
    );

    const submissionId = result?.insertId ?? null;
    return res.json({ success: true, saved_count: cleaned.length, submission_id: submissionId });
  } catch (err) {
    console.error('[answers/bulk] error:', err);
    res.status(500).json({ error: 'Internal error while saving answers' });
  }
});

/* ============ 제출 이력 ============ */
router.get('/submissions/me', requireAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await pool.query(
      `SELECT submission_id AS id, inputdate, YEAR(inputdate) AS year
       FROM esg_user_answer
       WHERE user_id = ?
       ORDER BY inputdate DESC`,
      [userId]
    );
    res.json({ submissions: rows });
  } catch (e) {
    console.error('[submissions/me] query error:', e);
    res.status(500).json({ error: 'Internal error while loading submissions' });
  }
});

/* ============ 특정 제출 상세 ============ */
router.get('/submissions/:id', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const sid = Number(req.params.id);

  if (!Number.isFinite(sid)) {
    return res.status(400).json({ error: 'invalid submission id' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT answerjson, inputdate
       FROM esg_user_answer
       WHERE user_id = ? AND submission_id = ?
       LIMIT 1`,
      [userId, sid]
    );

    if (!rows.length) return res.status(404).json({ error: 'submission not found' });

    let payload;
    try {
      payload = typeof rows[0].answerjson === 'string'
        ? JSON.parse(rows[0].answerjson)
        : rows[0].answerjson;
    } catch (e) {
      return res.status(500).json({ error: 'Invalid answerjson format' });
    }

    const items = Array.isArray(payload?.answers) ? payload.answers : [];
    const cats = ['Environment', 'Social', 'Governance'];
    const totals = { Environment: 0, Social: 0, Governance: 0 };
    const yesCounts = { Environment: 0, Social: 0, Governance: 0 };
    const noCounts  = { Environment: 0, Social: 0, Governance: 0 };

    for (const it of items) {
      const cat = it.category;
      if (!cats.includes(cat)) continue;
      totals[cat] += 1;
      if (it.answer === '예') yesCounts[cat] += 1;
      else noCounts[cat] += 1;
    }

    const weights = { Environment: 35, Social: 35, Governance: 30 };
    const scores = {
      Environment: totals.Environment ? (yesCounts.Environment / totals.Environment) * weights.Environment : 0,
      Social:      totals.Social      ? (yesCounts.Social      / totals.Social)      * weights.Social      : 0,
      Governance:  totals.Governance  ? (yesCounts.Governance  / totals.Governance)  * weights.Governance  : 0,
    };
    const totalScore = scores.Environment + scores.Social + scores.Governance;

    res.json({
      submission_id: sid,
      savedAt: rows[0].inputdate,
      totals, yesCounts, noCounts, weights,
      scores: {
        Environment: Number(scores.Environment.toFixed(2)),
        Social: Number(scores.Social.toFixed(2)),
        Governance: Number(scores.Governance.toFixed(2)),
        total: Number(totalScore.toFixed(2)),
      },
    });
  } catch (err) {
    console.error('[submissions/:id] query error:', err);
    res.status(500).json({ error: 'Internal error while loading submission detail' });
  }
});

/* ============ 결과 A: 기업별 ESG 평가 (총점 비교) ============ */
router.get('/report/company', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.company, a.submission_id, a.inputdate, a.answerjson
       FROM esg_user_answer a
       JOIN signup_login u ON a.user_id = u.user_id
       WHERE a.inputdate = (
         SELECT MAX(inputdate) 
         FROM esg_user_answer 
         WHERE user_id = a.user_id
       )
       ORDER BY u.company`
    );

    const result = rows.map(r => {
      let score = 0;
      try {
        const payload = typeof r.answerjson === 'string' ? JSON.parse(r.answerjson) : r.answerjson;
        const items = Array.isArray(payload?.answers) ? payload.answers : [];

        const cats = ['Environment', 'Social', 'Governance'];
        const weights = { Environment: 35, Social: 35, Governance: 30 };
        let scores = { Environment: 0, Social: 0, Governance: 0 };

        cats.forEach(cat => {
          const filtered = items.filter(it => it.category === cat);
          if (filtered.length) {
            const yesCount = filtered.filter(it => it.answer === '예').length;
            scores[cat] = (yesCount / filtered.length) * weights[cat];
          }
        });
        score = scores.Environment + scores.Social + scores.Governance;
      } catch {}
      return { company: r.company, score: Number(score.toFixed(2)) };
    });

    res.json({ companies: result });
  } catch (err) {
    console.error('[report/company] error:', err);
    res.status(500).json({ error: 'Internal error while loading company report' });
  }
});

/* ============ 결과 B: 분야별 '아니오' 취약점 분석 ============ */
router.get('/report/weakness', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT answerjson FROM esg_user_answer ORDER BY inputdate DESC`
    );

    const counters = {};
    for (const row of rows) {
      let payload;
      try {
        payload = typeof row.answerjson === 'string' ? JSON.parse(row.answerjson) : row.answerjson;
      } catch { continue; }

      const items = Array.isArray(payload?.answers) ? payload.answers : [];
      for (const item of items) {
        if (item.answer !== '아니오') continue;
        const sub = item.subCategory || '기타';
        const cat = item.category?.[0]; // E / S / G
        if (!['E','S','G'].includes(cat)) continue;
        if (!counters[sub]) counters[sub] = { E:0, S:0, G:0 };
        counters[sub][cat] += 1;
      }
    }

    const chartData = Object.entries(counters).map(([subCategory, vals]) => ({
      subCategory,
      E: vals.E,
      S: vals.S,
      G: vals.G
    }));

    res.json({ weaknesses: chartData });
  } catch (err) {
    console.error('[report/weakness] error:', err);
    res.status(500).json({ error: 'Internal error while loading weakness report' });
  }
});

export default router;
