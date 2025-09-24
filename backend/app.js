import express from 'express';
import cors from 'cors';
import faqRouter from './routes/faq.js';
import faqresRouter from './routes/faq_res.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/faq',faqRouter);
app.use('/faq_res',faqresRouter);


app.listen(3000);