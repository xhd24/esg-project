import styles from './css/FAQ.module.css';
import { useEffect, useState } from "react";
import { getQueryHx, writeQuery } from "../api.js";
import { useNavigate } from 'react-router-dom';

export function FAQWrite() {
  const [category, setCategory] = useState();
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const userId = sessionStorage.userId;

  const navigate = useNavigate();

  const handleQuery = async (e) => {
    e.preventDefault();
    const res = await writeQuery(title, userId, company, email, category, content);
    if (res.success) {
      navigate('/faq');
    }
  }

  return (
    <div>
      <form onSubmit={handleQuery}>
        <ul className={styles.queryBox}>
          <li className={styles.queryList}>
            <span className={styles.subTitle}>카테고리</span>
            <input type='radio' name='category' id='induction' value='induction' checked={category === 'induction'} onChange={(e) => setCategory(e.target.value)} /> <label htmlFor='induction'>도입</label>
            <input type='radio' name='category' id='ESG' value='ESG' checked={category === 'ESG'} onChange={(e) => setCategory(e.target.value)} /> <label htmlFor='ESG'>ESG 검증 평가</label>
            <input type='radio' name='category' id='Carb' value='Carb' checked={category === 'Carb'} onChange={(e) => setCategory(e.target.value)} /> <label htmlFor='Carb'>탄소 배출량 계산</label>
          </li>
          <li className={styles.queryList}>
            <span className={styles.subTitle}>회사명/이름</span> <input type='text' name='company' value={company} onChange={(e) => setCompany(e.target.value)} />
          </li>
          <li className={styles.queryList}>
            <span className={styles.subTitle}>이메일</span> <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <span className={styles.miniText}> * 입력하신 이메일로 답변이 전송됩니다.</span>
          </li>
          <li className={styles.queryList}>
            <span className={styles.subTitle}>제목</span> <input type='title' name='title' value={title} onChange={(e) => setTitle(e.target.value)} />
          </li>
          <li className={styles.queryList}>
            <span className={styles.subTitle}>문의 내용</span> <textarea name="query" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
          </li>
        </ul>
        <button className={styles.button} type='submit'>
          작성하기
        </button>
      </form>
    </div>
  );
}

export function FAQHistory() {
  const [posts, setPosts] = useState([]);

  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    getQueryHx(userId).then(setPosts);
  }, []);

  return (
    <div className={styles["table-wrapper"]}>
      <table className={styles.table}>
        <colgroup>
          <col style={{ width: "20%" }} />
          <col style={{ width: "60%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>
        <thead>
          <tr>
            <td>카테고리</td>
            <td> 제목 </td>
            <td>문의 일자</td>
          </tr>
        </thead>
        {/* db 연결 후 수정 필요 임시로 연결해놓음 */}
        <tbody>
          {posts.map((p, i) => {
            const date = p.inquiry_date;
            return (
              <tr key={i}>
                <td>{p.category}</td>
                <td>{p.inquiry_title}</td>
                <td>{date.split("T")[0]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}