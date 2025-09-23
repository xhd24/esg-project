import {Router} from 'express';
import { getQueryHx,addQuery } from '../db.js';

const router = Router();

//목록
router.get('/',async(req,res)=>{
    const posts = await getQueryHx();
    res.json(posts);
});

//글작석
router.post("/write", async (req, res) => {
  const { title, content, user_id } = req.body;
  await addQuery(title, content, user_id);
  res.json({ success: true });
});

export default router;