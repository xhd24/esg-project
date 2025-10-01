import { Router } from 'express';
import { inputC1Query, inputC1_1Query, getCarbonQuery, getCarbonQuery2, deleteC1Row, editC1row, editC2row, deleteC3Row, editC3row } from '../db.js';
import { inputC2Query } from '../db.js';

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

    const shipKey = inn.shipKey;
    const startDate = inn.startDate;
    const endDate = inn.endDate;
    const step1 = inn.items[0];
    const step2 = inn.items[1];
    const step3 = inn.items[2];
    const step4 = inn.items[3];
    const step5 = inn.items[4];
    const step6 = inn.items[5];
    const step7 = inn.items[6];
    const step8 = inn.items[7];
    const userId = inn.userId;
    const ioType = 'IN'

    await inputC1_1Query(userId, ioType, shipKey, startDate, endDate, step1, step2, step3, step4, step5, step6, step7, step8);
    res.json({ success: true });
});

router.post('/c3', async (req, res) => {
    const userId = req.body.userKey;
    const posts = await getCarbonQuery(userId) || '';
    const posts2 = await getCarbonQuery2(userId) || '';
    res.json({ posts: posts, posts2: posts2 });
});

router.post('/c4', async (req, res) => {
    const { form } = req.body;
    const shipKey = form.shipKey;
    const startDate = form.startDate;
    const endDate = form.endDate;
    const fuelType = form.energyType;
    const userKey = form.userKey;
    let grade = 'E';

    const amount = Number(String(form.amount || "0").replace(/,/g, ""));
    const distanceNm = Number(String(form.distanceNm || "0").replace(/,/g, ""));
    const capacityTon = Number(String(form.capacityTon || "0").replace(/,/g, ""));

    let tco2 = 0;
    let c2 = 0;

    if (fuelType === 'MGO') {
        tco2 = amount * 3.206;
    } else if (fuelType === 'HFO') {
        tco2 = amount * 3.114;
    } else {
        tco2 = amount * 2.750;
    }

    c2 = (tco2 * 1e6) / (Number(distanceNm) * Number(capacityTon));

    if (c2 <= 3.91) {
        grade = 'A';
    } else if (c2 > 3.91 && c2 <= 4.28) {
        grade = 'B';
    } else if (c2 > 4.28 && c2 <= 4.83) {
        grade = 'C';
    } else if (c2 > 4.83 && c2 <= 5.37) {
        grade = 'D';
    } else {
        grade = 'E';
    }
    await inputC2Query(shipKey, startDate, endDate, fuelType, amount, distanceNm, capacityTon, tco2, c2, userKey, grade);
    res.json({ success: true });
});

router.post('/delete', async (req, res) => {
    const id = req.body.id;
    await deleteC1Row(id);
    res.json({ success: true });
});

router.post('/edit1', async (req, res) => {
    const c1 = req.body.input;
    await editC1row(c1.c1_id, c1.c1_1, c1.c1_2, c1.c1_3, c1.c1_4, c1.c1_5, c1.c1_6, c1.c1_7, c1.c1_8);
    res.json({ success: true });
});

router.post('/edit2', async (req, res) => {
    const c2 = req.body.input;
    await editC2row(c2.c2_id, c2.c2_1, c2.c2_2, c2.c2_3, c2.c2_4, c2.c2_5, c2.c2_6, c2.c2_7, c2.c2_8, c2.c2_9, c2.c2_10, c2.c2_11);
    res.json({ success: true });
});

router.post('/delete3', async (req, res) => {
    const id = req.body.id;
    await deleteC3Row(id);
    res.json({ success: true });
});

router.post('/edit3', async (req, res) => {
    const c3 = req.body.input;
    await editC3row(c3.c3_id, c3.c3_1, c3.c3_2, c3.c3_3, c3.c3_4, c3.c3_5, c3.c3_6, c3.c3_7);
    res.json({ success: true });
});


export default router;