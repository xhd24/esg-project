// src/pages/Carbon.jsx
import { NavLink, Outlet } from "react-router-dom";
import styles from "./css/Carbon.module.css";

function Carbon() {
  return (
    <div className={styles.container}>
      {/* 네비게이션 */}
      <nav className={styles.nav}>
        <NavLink
          to=""
          end
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          내부/외부 공정 배출량
        </NavLink>

        <NavLink
          to="c2"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          운항 배출량
        </NavLink>

        <NavLink
          to="c3"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          최신 입력값
        </NavLink>
      </nav>

      {/* 아래에 페이지 내용 */}
      <Outlet />
    </div>
  );
}

export default Carbon;
