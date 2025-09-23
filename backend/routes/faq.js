import {Router} from 'express';
import { getPosts } from '../db.js';

const router = Router();

router.get('/',async(req,res)=>{
    const posts = await getPosts();
    res.json(posts);
})

export default router;