// src/pages/FAQ.jsx (혹은 현재 파일명 유지)
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
  const [submitting, setSubmitting] = useState(false);
  const userKey = sessionStorage.getItem('userKey');
  const userId = sessionStorage.getItem('userId');

  const navigate = useNavigate();

  const handleQuery = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // --- 간단한 유효성 검사 ---
    if (!category) return window.alert("카테고리를 선택해 주세요.");
    if (!title.trim()) return window.alert("제목을 입력해 주세요.");
    if (!content.trim()) return window.alert("문의 내용을 입력해 주세요.");
    if (!email.trim()) return window.alert("이메일을 입력해 주세요.");
    // 아주 간단한 이메일 패턴 체크 (필요하면 강화 가능)
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) return window.alert("이메일 형식이 올바르지 않습니다.");

    try {
      setSubmitting(true);
      const res = await writeQuery(title, userId, userKey, company, email, category, content);
      if (res.success) {
        window.alert("문의가 정상적으로 등록되었습니다.\n확인을 누르면 문의 내역으로 이동합니다.");
        navigate('/faq');
      } else {
        window.alert("등록에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } catch (err) {
      console.error(err);
      window.alert("오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleQuery}>
        <ul className={styles.queryBox}>
          <li className={styles.queryList}>
            <span className={styles.subTitle}>카테고리</span>
            <input
              type='radio' name='category' id='induction' value='induction'
              checked={category === 'induction'}
              onChange={(e) => setCategory(e.target.value)}
            />
            <label htmlFor='induction'>도입</label>

            <input
              type='radio' name='category' id='ESG' value='ESG'
              checked={category === 'ESG'}
              onChange={(e) => setCategory(e.target.value)}
            />
            <label htmlFor='ESG'>ESG 검증 평가</label>

            <input
              type='radio' name='category' id='Carb' value='Carb'
              checked={category === 'Carb'}
              onChange={(e) => setCategory(e.target.value)}
            />
            <label htmlFor='Carb'>탄소 배출량 계산</label>
          </li>

          <li className={styles.queryList}>
            <span className={styles.subTitle}>회사명/이름</span>
            <input
              type='text' name='company'
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </li>

          <li className={styles.queryList}>
            <span className={styles.subTitle}>이메일</span>
            <input
              type='email' name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <span className={styles.miniText}> * 입력하신 이메일로 답변이 전송됩니다.</span>
          </li>

          <li className={styles.queryList}>
            <span className={styles.subTitle}>제목</span>
            <input
              type='title' name='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문의 제목을 입력하세요"
            />
          </li>

          <li className={styles.queryList}>
            <span className={styles.subTitle}>문의 내용</span>
            <textarea
              name="query"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="문의 내용을 입력하세요"
            />
          </li>
        </ul>

        <button className={styles.button} type='submit' disabled={submitting}>
          {submitting ? "작성 중..." : "작성하기"}
        </button>
      </form>
    </div>
  );
}

export function FAQHistory() {
  const [posts, setPosts] = useState([]);
  const userKey = sessionStorage.getItem('userKey');
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    getQueryHx(userKey).then(setPosts);
  }, [userKey]);

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
            <td>제목</td>
            <td>문의 일자</td>
          </tr>
        </thead>
        <tbody>
          {posts.map((p, i) => {
            const date = p.inquiry_date || "";
            return (
              <tr key={i}>
                <td>{p.category}</td>
                <td>{p.inquiry_title}</td>
                <td>{date.split("T")[0]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
