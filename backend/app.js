import express from "express";
import cors from "cors";
import faqRouter from "./routes/faq.js";
import signupRouter from "./routes/signup.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/faq", faqRouter);        
app.use("/signup", signupRouter); 

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
