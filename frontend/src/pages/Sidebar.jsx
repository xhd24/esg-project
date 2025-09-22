import React, { useEffect, useRef, useState } from "react";
import styles from "./css/sidebar.module.css";
import menu from '../assets/images/menu_icon.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link} from "react-router-dom";



const Sidebar = ({ width = 280, children }) => {
  const [isOpen, setOpen] = useState(false);
  const [xPosition, setX] = useState(width);
  const side = useRef();

  // button 클릭 시 토글
  const toggleMenu = () => {
    if (xPosition > 0) {
      setX(0);
      setOpen(true);
    } else {
      setX(width);
      setOpen(false);
    }
  };

  // 사이드바 외부 클릭시 닫히는 함수
  const handleClose = async e => {
    let sideArea = side.current;
    let sideCildren = side.current.contains(e.target);
    if (isOpen && (!sideArea || !sideCildren)) {
      await setX(width);
      await setOpen(false);
    }
  }

  useEffect(() => {
    window.addEventListener('click', handleClose);
    return () => {
      window.removeEventListener('click', handleClose);
    };
  })


  return (
    <div className={styles.container}>
      <div ref={side} className={styles.sidebar} style={{ width: `${width}px`, height: '100%', transform: `translatex(${-xPosition}px)` }}>
        <button onClick={() => toggleMenu()}
          className={styles.button} >
          {isOpen ?
            <span>X</span> : <img src={menu} alr="contact open button" className={styles.openBtn} />
          }
        </button>

        <div className={styles.content}>
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link to="/report" className="nav-link active" aria-current="page">Reports</Link>
            </li>
            <li className="nav-item">
              <Link to="/history" className="nav-link" >History</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};


export default Sidebar;