import { Router } from 'express';
import { getUser } from '../db.js'
import bcrypt from "bcryptjs";

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { id, pw } = req.body;

    const user = await getUser(id);

    if (!user || user.length === 0) {
      return res.status(400).json({
        error: '존재하지 않는 아이디입니다.',
        success: false
      });
    }

    const isMatch = await bcrypt.compare(pw, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({
        error: "비밀번호가 일치하지 않습니다.",
        success: false
      });
    }

    return res.json({
      success: true,
      userKey: user.user_id,       
      userId: user.login_id,
      message: "로그인 성공!"
    });
  } catch (err) {
    console.error('로그인 실패:', err);
    return res.status(500).json({ success: false, error: '서버 오류, 잠시 후 다시 시도해주세요.' });
  }
});

export default router;