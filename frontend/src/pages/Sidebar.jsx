// Sidebar.jsx
import React, { useEffect, useRef, useState } from "react";
import styles from "./css/sidebar.module.css";
import menu from '../assets/images/menu_icon.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

const Sidebar = ({ width = 280, isOpen, setOpen }) => {
  const side = useRef();
  const [userId, setUserId] = useState('');

  const toggleMenu = () => {
    setOpen(!isOpen);
  };

  // 사이드바 외부 클릭시 닫기
  const handleClose = e => {
    if (isOpen && side.current && !side.current.contains(e.target)) {
      setOpen(false);
    }
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

  useEffect(() => {
    window.addEventListener('click', handleClose);
    return () => {
      window.removeEventListener('click', handleClose);
    };
  });

  return (
    <div
      ref={side}
      className={styles.sidebar}
      style={{
        width: `${width}px`,
        height: '100%',
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : `-${width}px`,
        transition: "left 0.3s ease",
        background: "#fff",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        zIndex: 1000
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();   // 외부 클릭 이벤트로 안 가게 막음
          toggleMenu();
        }}
        className={styles.button}
      >
        {isOpen ? (
          <span className={styles.close}>X</span>
        ) : (
          <img
            src={menu}
            alt="menu open"
            className={styles.openBtn}
          />
        )}
      </button>
      <br />
      <div className={styles.content}>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/report" className="nav-link"><span className={styles.white}>Reports</span></Link>
          </li>
          <div className={styles.divider}></div> {/* 구분선 */}
          <li className="nav-item">
            <Link to="/ESG_reports" className="nav-link"><span className={styles.white}>ESG_Reports</span></Link>
          </li>
          <div className={styles.divider}></div> {/* 구분선 */}
          {userId==='admin' ?
            <li className="nav-item">
              <Link to="/faq_res" className="nav-link"><span className={styles.white}>문의 사항 관리</span></Link>
            </li> :
            ''
          }
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
