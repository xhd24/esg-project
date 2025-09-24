import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "./css/Carbon.module.css";

function Carbon() {
  const location = useLocation();

  return (
    <div className={styles.container}>
      {/* 네비게이션 */}
      <nav className={styles.nav} style={{ paddingLeft: 103 }}>
        <Link
          to=""
          className={`${styles.link} ${location.pathname === "/carbon" ? styles.active : ""}`}
        >
          C1
        </Link>
        <Link
          to="c2"
          className={`${styles.link} ${location.pathname === "/carbon/c2" ? styles.active : ""}`}
        >
          C2
        </Link>
        <Link
          to="c3"
          className={`${styles.link} ${location.pathname === "/carbon/c3" ? styles.active : ""}`}
        >
          C3
        </Link>
      </nav>

      {/* 아래에 페이지 내용 */}
      <Outlet />
    </div>
  );
}

export default Carbon;
