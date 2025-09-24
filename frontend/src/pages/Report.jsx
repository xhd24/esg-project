import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "./css/Carbon.module.css";

function Report() {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <nav className={styles.nav} style={{ paddingLeft: 80 }}>
        <Link
          to="c1.result"
          className={`${styles.link} ${location.pathname === "/report/c1.result" || location.pathname === "/report" ? styles.active : ""}`}
        >
          C1.result
        </Link>
        <Link
          to="c2.result"
          className={`${styles.link} ${location.pathname === "/report/c2.result" ? styles.active : ""}`}
        >
          C2.result
        </Link>
        <Link
          to="c3.result"
          className={`${styles.link} ${location.pathname === "/report/c3.result" ? styles.active : ""}`}
        >
          C3.result
        </Link>
      </nav>

      <Outlet />
    </div>
  );
}

export default Report;
