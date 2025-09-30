// src/pages/Sidebar.jsx
import React, { useEffect, useState } from "react";
import styles from "./css/sidebar.module.css";
import menu from "../assets/images/menu_icon.svg";
import { Link } from "react-router-dom";

const Sidebar = ({ width = 280, isOpen, setOpen }) => {
  const [userId, setUserId] = useState("");

  const toggleMenu = (e) => {
    e?.stopPropagation();
    setOpen(!isOpen);
  };

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    setUserId(storedUserId || "");
  }, []);

  useEffect(() => {
    const syncLoginState = () => {
      setUserId(sessionStorage.getItem("userId") || "");
    };
    window.addEventListener("storage", syncLoginState);
    return () => window.removeEventListener("storage", syncLoginState);
  }, []);

  return (
    <>
      {/* 오버레이(열렸을 때만) */}
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 토글 버튼 */}
      <button
        onClick={toggleMenu}
        className={`${styles.button} ${isOpen ? styles.buttonOpen : ""}`}
        aria-label={isOpen ? "사이드바 닫기" : "사이드바 열기"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <span className={styles.closeX} aria-hidden="true">✕</span>
        ) : (
          <img src={menu} alt="" className={styles.openBtn} />
        )}
      </button>

      {/* 사이드바 */}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}
        style={{ "--sidebar-w": `${width}px` }}
        role="navigation"
        aria-label="보조 메뉴"
      >
        {/* 맨 위 유저 배지 (살짝 오른쪽 패딩) */}
        {userId && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "20px 20px 12px 30px", // ← 여기로 오른쪽으로 살짝 이동
              borderBottom: "1px solid rgba(255,255,255,.08)"
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                background:
                  "radial-gradient(circle at 35% 35%, #34d399, #10b981)",
                boxShadow: "0 0 0 3px rgba(16,185,129,.15)"
              }}
            />
            <span
              style={{
                color: "rgba(255,255,255,0.95)",
                fontWeight: 700,
                letterSpacing: ".2px",
                whiteSpace: "nowrap",
              }}
              title={userId}
            >
              {userId}
            </span>
          </div>
        )}

        {/* 메뉴 */}
        <nav className={styles.menu}>
          <Link
            to="/report"
            className={styles.item}
            onClick={() => setOpen(false)}
          >
            <span className={styles.ico} aria-hidden="true">
              {/* report icon */}
              <svg viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 
              2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm0 2.5L19.5 
              10H14V4.5ZM8 13h8v2H8v-2Zm0 4h8v2H8v-2Zm0-8h4v2H8V9Z"/>
              </svg>
            </span>
            <span className={styles.txt}>Reports</span>
          </Link>

          <Link
            to="/ESG_reports"
            className={styles.item}
            onClick={() => setOpen(false)}
          >
            <span className={styles.ico} aria-hidden="true">
              {/* chart icon */}
              <svg viewBox="0 0 24 24">
                <path d="M3 3h2v18H3V3Zm16 8h2v10h-2V11Zm-8 
              4h2v6h-2v-6Zm-4-8h2v14H7V7Zm8-4h2v18h-2V3Z"/>
              </svg>
            </span>
            <span className={styles.txt}>ESG Reports</span>
          </Link>

          {userId === "admin" && (
            <Link
              to="/faq_res"
              className={styles.item}
              onClick={() => setOpen(false)}
            >
              <span className={styles.ico} aria-hidden="true">
                {/* shield icon */}
                <svg viewBox="0 0 24 24">
                  <path d="M12 2 4 5v6c0 
                5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Zm0 
                2.2 6 2.2v4.6c0 4.1-2.7 8-6 9.2-3.3-1.2-6-5.1-6-9.2V6.4l6-2.2ZM11 
                7h2v5h-2V7Zm0 6h2v2h-2v-2Z"/>
                </svg>
              </span>
              <span className={styles.txt}>문의 사항 관리</span>
            </Link>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
