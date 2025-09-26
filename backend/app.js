import express from 'express';
import cors from 'cors';
import faqRouter from './routes/faq.js';
import faqresRouter from './routes/faq_res.js';
import signupRouter from "./routes/signup.js";
import loginRouter from "./routes/login.js";
import esgRouter from './routes/esg.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/faq',faqRouter);
app.use('/faq_res',faqresRouter);
app.use("/signup", signupRouter); 
app.use("/login", loginRouter); 
app.use('/esg', esgRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
