// src/pages/FAQRes.jsx
import styles from "./css/FAQRes.module.css";
import { useEffect, useMemo, useState } from "react";
import { getQueryHxAll } from "../api.js";
import { useNavigate } from "react-router-dom";

function FAQRes() {
  const [posts, setPosts] = useState([]);
  const [sortKey, setSortKey] = useState("faq_id");  // 기본: 순번
  const [sortDir, setSortDir] = useState("asc");     // 기본: 오름차순(1이 맨 위)
  const navigate = useNavigate();

  useEffect(() => {
    getQueryHxAll().then((list) => {
      setPosts(list || []);
    });
  }, []);

  const formatDate = (iso) => new Date(iso).toISOString().slice(0, 10);

  const sortedPosts = useMemo(() => {
    const arr = [...posts];
    const dir = sortDir === "asc" ? 1 : -1;

    arr.sort((a, b) => {
      switch (sortKey) {
        case "faq_id": {
          const A = Number(a.faq_id) || 0;
          const B = Number(b.faq_id) || 0;
          return (A - B) * dir;
        }
        case "category": {
          const A = (a.category || "").toString().toLowerCase();
          const B = (b.category || "").toString().toLowerCase();
          return A.localeCompare(B) * dir;
        }
        case "inquiry_date": {
          const A = new Date(a.inquiry_date).getTime() || 0;
          const B = new Date(b.inquiry_date).getTime() || 0;
          return (A - B) * dir;
        }
        default:
          return 0;
      }
    });
    return arr;
  }, [posts, sortKey, sortDir]);

  const onSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc")); // 같은 컬럼 클릭 시 방향 토글
    } else {
      setSortKey(key);
      setSortDir("asc"); // 새 컬럼은 오름차순부터
    }
  };

  const SortBtn = ({ label, active, dir }) => (
    <button
      className={styles.sortBtn}
      data-active={active ? "true" : "false"}
      aria-pressed={active ? true : false}
      aria-label={`${label} 정렬 ${dir === "asc" ? "오름차순" : "내림차순"}`}
      type="button"
    >
      <span>{label}</span>
      <svg
        className={styles.sortIcon}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {/* 위 화살표 */}
        <path
          d="M7 14l5-6 5 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity={active && dir === "asc" ? 1 : 0.35}
        />
        {/* 아래 화살표 */}
        <path
          d="M7 10l5 6 5-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity={active && dir === "desc" ? 1 : 0.35}
        />
      </svg>
    </button>
  );

  return (
    <div className={styles["table-wrapper"]}>
      <table className={styles.table}>
        <caption className={styles.caption}></caption>
        <colgroup>
          <col style={{ width: "10%" }} />
          <col style={{ width: "16%" }} />
          <col /> {/* 제목 */}
          <col style={{ width: "16%" }} />
          <col style={{ width: "18%" }} />
        </colgroup>

        <thead>
          <tr>
            <td onClick={() => onSort("faq_id")} role="button" className={styles.thBtn}>순번
              <SortBtn label="순번" active={sortKey === "faq_id"} dir={sortDir} />
            </td>
            <td onClick={() => onSort("category")} role="button" className={styles.thBtn}>카테고리
              <SortBtn label="카테고리" active={sortKey === "category"} dir={sortDir} />
            </td>
            <td className={styles.thStatic}>제목</td>
            <td className={styles.thStatic}>작성자</td>
            <td onClick={() => onSort("inquiry_date")} role="button" className={styles.thBtn}>문의 일자
              <SortBtn label="문의 일자" active={sortKey === "inquiry_date"} dir={sortDir} />
            </td>
          </tr>
        </thead>

        <tbody>
          {sortedPosts.map((p) => (
            <tr
              key={p.faq_id}
              className={styles.row}
              onClick={() => navigate(`/faq_res/${p.faq_id}`)}
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                navigate(`/faq_res/${p.faq_id}`)
              }
            >
              <td>{p.faq_id}</td>
              <td>
                <span
                  className={styles.chip}
                  data-cat={(p.category || "").toLowerCase()}
                  title={p.category}
                >
                  {p.category}
                </span>
              </td>
              <td className={styles.titleCell} title={p.inquiry_title}>
                {p.inquiry_title}
              </td>
              <td>{p.requester}</td>
              <td>{formatDate(p.inquiry_date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FAQRes;
