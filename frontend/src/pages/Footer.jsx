import styles from "./css/Footer.module.css";
import logo from "../assets/images/footer_logo.png";
import { Link } from "react-router-dom";

function Footer() {
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      {/* 상단 영역 */}
      <div className={styles.topWrap}>
        <div className={styles.topInner}>
          <div className={styles.brandRow}>
            <img src={logo} alt="TrueESG 로고" className={styles.logo} />
            <div className={styles.brandMeta}>
              <strong className={styles.brandTitle}>TrueESG</strong>
              <span className={styles.brandTagline}>
                Environmental · Social · Governance Insights
              </span>
            </div>
          </div>

        
        </div>

        {/* 소셜 아이콘 */}
        <div className={styles.socials}>
          <a href="#" aria-label="GitHub" className={styles.socialBtn}>
            <svg viewBox="0 0 24 24" className={styles.icon}>
              <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48
              0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.2-3.37-1.2-.45-1.14-1.1-1.45-1.1-1.45-.9-.61.07-.6.07-.6
              1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.64.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.93
              0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.26.1-2.63 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.84c.85 0 1.7.11 2.5.32
              1.9-1.29 2.74-1.02 2.74-1.02.56 1.37.21 2.38.11 2.63.64.7 1.03 1.6 1.03 2.69 0 3.83-2.34 4.67-4.57 4.92.36.31.68.92.68 1.86
              0 1.34-.01 2.42-.01 2.75 0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
            </svg>
          </a>
          <a href="#" aria-label="LinkedIn" className={styles.socialBtn}>
            <svg viewBox="0 0 24 24" className={styles.icon}>
              <path d="M6.94 6.5a1.94 1.94 0 1 1 0-3.88 1.94 1.94 0 0 1 0 3.88ZM3.75 8.25h6.38v12H3.75v-12Zm8.62 0h6.13v1.64h.09c.85-1.51 2.94-2.06 4.51-2.06 4.83 0 5.72 3.18 5.72 7.31v5.11h-6.37v-4.53c0-1.08-.02-2.46-1.5-2.46-1.5 0-1.73 1.17-1.73 2.38v4.61h-6.37v-12Z" />
            </svg>
          </a>
          <a href="#" aria-label="Mail" className={styles.socialBtn}>
            <svg viewBox="0 0 24 24" className={styles.icon}>
              <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
            </svg>
          </a>
        </div>
      </div>

      {/* 가는 구분선 */}
      <hr className={styles.hr} />

      {/* 하단 영역 */}
      <div className={styles.bottom}>
        <ul className={styles.nav}>
          <li><Link to="/" onClick={scrollTop}>홈</Link></li>
          <li><Link to="/carbon" onClick={scrollTop}>탄소배출량</Link></li>
          <li><Link to="/assessment" onClick={scrollTop}>ESG 평가</Link></li>
          <li><Link to="/faq" onClick={scrollTop}>FAQ</Link></li>
        </ul>

        <div className={styles.contact}>
          <p>문의 : bundangboy@sexyboy.com | Tel : 010-9114-4753 | 대표이사 : 박진우</p>
          <p className={styles.copy}>© 2025 ESG Monitoring. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
