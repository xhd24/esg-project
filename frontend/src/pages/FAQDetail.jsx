import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQueryDetail } from "../api.js";
import styles from './css/FAQRes.module.css';

function FAQDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    getQueryDetail(id).then(setPost);
  }, [id]);

  if (!post) return <div>Loading...</div>;

  const data = post[0];

  return (
    <div className={styles.detailWrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>{data.inquiry_title}</h1>
        <span className={styles.category}>{data.category}</span>
      </div>

      <div className={styles.meta}>
        <span className={styles.requester}>by {data.requester}</span>
        <span className={styles.separator}>|</span>
        <span className={styles.company}>{data.company}</span>
        <span className={styles.separator}>|</span>
        <span className={styles.email}>{data.email}</span>
        <span className={styles.separator}>|</span>
        <span className={styles.date}>{data.inquiry_date}</span>
      </div>

      <div className={styles.content}>{data.content}</div>
    </div>
  );
}


export default FAQDetail;