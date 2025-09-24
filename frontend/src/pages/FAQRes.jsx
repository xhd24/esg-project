import styles from './css/FAQRes.module.css';
import { useEffect, useState } from "react";
import { getQueryHxAll} from "../api.js";
import { useNavigate } from 'react-router-dom';

function FAQRes() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getQueryHxAll().then(setPosts);
  }, []);
  
  return (
    <div className={styles["table-wrapper"]}>
      <table className={styles.table}>
        <colgroup>
          <col style={{ width: "5%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "50%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
        </colgroup>
        <thead>
          <tr>
            <td>순번</td>
            <td>카테고리</td>
            <td>제목</td>
            <td>작성자</td>
            <td>문의 일자</td>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => {
            const date = p.inquiry_date;
            return (
              <tr key={p.faq_id} onClick={()=>navigate(`/faq_res/${p.faq_id}`)}>
                <td>{p.faq_id}</td>
                <td>{p.category}</td>
                <td>{p.inquiry_title}</td>
                <td>{p.requester}</td>
                <td>{date.split("T")[0]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default FAQRes;
