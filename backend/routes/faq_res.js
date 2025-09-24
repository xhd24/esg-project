import { Router } from 'express';
import { getQueryHxAll,getQueryDetail } from '../db.js';

const router = Router();

//목록
router.get('/', async (req, res) => {
  const posts = await getQueryHxAll();
  res.json(posts);
});

router.get('/:id', async (req, res) => {
  const post = await getQueryDetail(req.params.id);
  res.json(post||{});
});

export default router;