import { Router } from 'express';
import { getQueryHx, addQuery } from '../db.js';

const router = Router();

//목록
router.post('/', async (req, res) => {
  const { userId } = req.body;
  const posts = await getQueryHx(userId) || '';
  res.json(posts);
});

//글작석
router.post("/write", async (req, res) => {
  const { inquiry_title, requester, user_id, company, email, category, content } = req.body;
  await addQuery(inquiry_title, requester, user_id, company, email, category, content);
  res.json({ success: true });
});

export default router;