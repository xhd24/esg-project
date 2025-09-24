import { Link, Outlet, useLocation} from "react-router-dom";
import styles from './css/FAQ.module.css';

function FAQ() {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link to="" className={`${styles.link} ${location.pathname === "/faq" ? styles.active : ""}`}> 문의 내역 </Link>
        <Link to="write" className={`${styles.link} ${location.pathname === "/faq/write" ? styles.active : ""}`}> 문의하기 </Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default FAQ;
