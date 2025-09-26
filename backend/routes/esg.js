// routes/esg.js
import express from 'express';
import { pool } from '../db.js';
import questionsSource from '../questions.js'; // { Environment:[], Social:[], Governance:[] }

const router = express.Router();

router.use((req, _res, next) => {
  console.log(`[ESG] ${req.method} ${req.originalUrl}`);
  next();
});

/* =========================
   Auth helpers
   ========================= */
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
    // 존재 유저 확인(옵션)
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

/* =========================
   질문 목록 (정적 소스에서 제공)
   GET /esg/questions?category=Environment|Social|Governance
   ========================= */
router.get('/questions', requireAuth, async (req, res) => {
  const { category } = req.query;
  if (!category) {
    // 모든 카테고리 합쳐서 내려주고 싶다면:
    const all = ['Environment','Social','Governance'].flatMap(cat =>
      (questionsSource[cat] || []).map(q => ({
        id: q.id,
        category: q.category,
        text: q.text,
        description: q.description || '',
        options: q.options || ['예','아니오'],
      }))
    );
    return res.json({ questions: all });
  }

  const list = (questionsSource[category] || []).map(q => ({
    id: q.id,
    category: q.category,
    text: q.text,
    description: q.description || '',
    options: q.options || ['예','아니오'],
  }));
  res.json({ questions: list });
});

/* =========================
   내 응답 조회
   GET /esg/answers/me?category=...
   - 최신 제출만 사용 (questionid별 MAX(inputdate))
   ========================= */
router.get('/answers/me', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { category } = req.query;

  // 전체 가져와서 앱 단에서 reduce 해도 되지만,
  // 여기서는 MySQL에서 최근 것만 뽑아오는 간단 방식(서브쿼리)로 처리
  const [rows] = await pool.query(
    `
    SELECT e.answerjson
    FROM esg_user_answer e
    JOIN (
      SELECT JSON_EXTRACT(answerjson, '$.questionid') AS qid, MAX(inputdate) AS latest
      FROM esg_user_answer
      WHERE user_id = ?
      GROUP BY JSON_EXTRACT(answerjson, '$.questionid')
    ) t ON JSON_EXTRACT(e.answerjson, '$.questionid') = t.qid
       AND e.inputdate = t.latest
    WHERE e.user_id = ?
    `,
    [userId, userId]
  );

  // { [question_id]: '예'|'아니오' } 형태로 반환
  const map = {};
  for (const r of rows) {
    try {
      const obj = JSON.parse(r.answerjson);
      if (category && obj.category !== category) continue;
      map[Number(obj.questionid)] = String(obj.answer || '');
    } catch (_) {}
  }
  res.json({ answers: map });
});

/* =========================
   일괄 저장(업서트 대체: 삭제 후 삽입)
   POST /esg/answers/bulk
   body: { answers: [{category, questionid, question, answer}] }
   ========================= */
router.post('/answers/bulk', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: 'answers empty' });
    }

    // 유효성(최소 필드)
    const cleaned = answers
      .map(a => ({
        category: a.category,
        questionid: Number(a.questionid),
        question: String(a.question || ''),
        answer: String(a.answer || ''),
      }))
      .filter(a => a.category && a.questionid);

    if (cleaned.length === 0) {
      return res.status(400).json({ error: 'no valid answers' });
    }

    // 같은 user & questionid 기존 레코드 삭제(중복 방지)
    const qids = [...new Set(cleaned.map(a => a.questionid))];
    // JSON_EXTRACT(answerjson, '$.questionid') = ?
    // 매개변수 바인딩 수 만큼 OR 조건 구성
    const whereOr = qids.map(() => `JSON_EXTRACT(answerjson, '$.questionid') = ?`).join(' OR ');
    await pool.query(
      `DELETE FROM esg_user_answer WHERE user_id = ? AND (${whereOr})`,
      [userId, ...qids]
    );

    // 새로 삽입
    const now = new Date();
    const values = cleaned.map(a => [userId, JSON.stringify(a), now]);
    await pool.query(
      `INSERT INTO esg_user_answer (user_id, answerjson, inputdate) VALUES ?`,
      [values]
    );

    res.json({ success: true, saved_count: cleaned.length });
  } catch (err) {
    console.error('[answers/bulk] error:', err);
    res.status(500).json({ error: 'Internal error while saving answers' });
  }
});

/* =========================
   리포트 (카테고리별 집계: 최신 제출 기준)
   GET /esg/report/me
   ========================= */
router.get('/report/me', requireAuth, async (req, res) => {
  const userId = req.user.id;

  // 최신 제출로 합치기
  const [rows] = await pool.query(
    `
    SELECT e.answerjson
    FROM esg_user_answer e
    JOIN (
      SELECT JSON_EXTRACT(answerjson, '$.questionid') AS qid, MAX(inputdate) AS latest
      FROM esg_user_answer
      WHERE user_id = ?
      GROUP BY JSON_EXTRACT(answerjson, '$.questionid')
    ) t ON JSON_EXTRACT(e.answerjson, '$.questionid') = t.qid
       AND e.inputdate = t.latest
    WHERE e.user_id = ?
    `,
    [userId, userId]
  );

  const counters = {
    Environment: { yes: 0, no: 0, total: 0 },
    Social: { yes: 0, no: 0, total: 0 },
    Governance: { yes: 0, no: 0, total: 0 },
  };

  for (const r of rows) {
    try {
      const obj = JSON.parse(r.answerjson);
      const cat = obj.category;
      if (!counters[cat]) continue;
      counters[cat].total += 1;
      if (obj.answer === '예') counters[cat].yes += 1;
      else if (obj.answer === '아니오') counters[cat].no += 1;
    } catch (_) {}
  }

  const report = ['Environment','Social','Governance'].map(cat => ({
    category: cat,
    yes: counters[cat].yes,
    no: counters[cat].no,
    total: counters[cat].total,
  }));

  res.json({ report });
});

export default router;
