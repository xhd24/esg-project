// Sidebar.jsx
import React, { useEffect, useRef } from "react";
import styles from "./css/sidebar.module.css";
import menu from '../assets/images/menu_icon.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

const Sidebar = ({ width = 280, isOpen, setOpen }) => {
  const side = useRef();

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
          <span>X</span>
        ) : (
          <img
            src={menu}
            alt="menu open"
            className={styles.openBtn}
          />
        )}
      </button>

      <div className={styles.content}>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link to="/report" className="nav-link">Reports</Link>
          </li>
          <li className="nav-item">
            <Link to="/history" className="nav-link">History</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
