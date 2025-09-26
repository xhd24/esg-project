import { Router } from 'express';
import { inputC1Query, inputC1_1Query,getCarbonQuery, getCarbonQuery2 } from '../db.js';

const router = Router();

//c1 - 1 입력
router.post('/c1', async (req, res) => {
    const { ext } = req.body;

    const shipKey = ext.shipKey;
    const startDate = ext.startDate;
    const endDate = ext.endDate;
    const step1 = ext.items[0];
    const step2 = ext.items[1];
    const step3 = ext.items[2];
    const step4 = ext.items[3];
    const step5 = ext.items[4];
    const userId = ext.userId;
    const ioType = 'OUT'

    await inputC1Query(userId, ioType, shipKey, startDate, endDate, step1, step2, step3, step4, step5);
    res.json({ success: true });
});

router.post('/c2', async (req, res) => {
    const { inn } = req.body;

    console.log(inn)
    const shipKey = inn.shipKey;
    const startDate = inn.startDate;
    const endDate = inn.endDate;
    const step1 = inn.steps[0];
    const step2 = inn.steps[1];
    const step3 = inn.steps[2];
    const step4 = inn.steps[3];
    const step5 = inn.steps[4];
    const step6 = inn.steps[5];
    const step7 = inn.steps[6];
    const step8 = inn.steps[7];
    const userId = inn.userId;
    const ioType = 'IN'

    await inputC1_1Query(userId, ioType, shipKey, startDate, endDate, step1, step2, step3, step4, step5, step6, step7, step8);
    res.json({ success: true });
});

router.get('/c3', async (req, res) => {
    const posts = await getCarbonQuery();
    const posts2 = await getCarbonQuery2();
    res.json({posts:posts, posts2:posts2});
});

export default router;