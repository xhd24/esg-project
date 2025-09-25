import styles from "./css/Footer.module.css";
import logo from "../assets/images/footer_logo.png";
import { Link } from "react-router-dom";

function Footer() {
    // 공통 스크롤 맨 위 함수
    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.top}>
                <img src={logo} alt="로고" className={styles.logo} />
            </div>

            <div className={styles.bottom}>
                <ul className={styles.nav}>
                    <li><Link to="/" onClick={scrollTop}>홈</Link></li>
                    <li><Link to="/carbon" onClick={scrollTop}>탄소배출량</Link></li>
                    <li><Link to="/assessment" onClick={scrollTop}>ESG 평가</Link></li>
                    <li><Link to="/faq" onClick={scrollTop}>FAQ</Link></li>
                </ul>

                <div className={styles.contact}>
                    <p>문의 : bundangboy@sexyboy.com | Tel : 010-9114-4753 | 대표이사 : 윤준영</p>
                    <p className={styles.copy}>© 2025 ESG Monitoring. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
