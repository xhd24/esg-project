import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/Home.module.css";
import main_esg from "../assets/images/main_esg.png";   // Hero 섹션 이미지
import main_esg2 from "../assets/images/main_esg2.png"; // 중간 배너 이미지

import icon1 from "../assets/images/icon1.png";
import icon2 from "../assets/images/icon2.png";
import icon3 from "../assets/images/icon3.png";

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  // 🔽 FAB용 상태: 스크롤이 화면 길이의 50% 이하인지 여부
  const [isHalfOrBelow, setIsHalfOrBelow] = useState(true);
  const [fabHidden, setFabHidden] = useState(false);

  const navigate = useNavigate();
  const handleClick = () => navigate("/assessment");
  const handleClick2 = () => navigate("/carbon");

  // Stats 배너 등장
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  // 🔽 FAB: 스크롤 위치 감지(실시간)
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || 0;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );
      const winHeight = window.innerHeight || document.documentElement.clientHeight || 0;
      const maxScroll = Math.max(1, docHeight - winHeight);
      const percent = (scrollTop / maxScroll) * 100;

      setIsHalfOrBelow(percent <= 50);
      setFabHidden(docHeight <= winHeight + 40); // 스크롤할 내용이 거의 없으면 숨김
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // 🔽 FAB 클릭: 50% 이하면 아래, 그 외엔 위로
  const handleFabClick = () => {
    const scrollTop = window.scrollY || 0;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    const winHeight = window.innerHeight || 0;
    const maxScroll = Math.max(1, docHeight - winHeight);
    const percent = (scrollTop / maxScroll) * 100;

    if (percent <= 50) {
      window.scrollTo({ top: docHeight, left: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  return (
    <div className={styles.home}>
      {/* ✅ Hero Section (이미지 단독) */}
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${main_esg})` }}
      ></section>

      {/* ✅ HeroContent (이미지 아래 따로 분리) */}
      <div className={styles.heroContent}>
        <h1 className={`${styles.heroTitle} ${styles.typing}`}>
          ESG 검증과 탄소배출 측정, <br /> 기업 지속가능성의 시작
        </h1>
        <p className={styles.heroSubtitle}>
          데이터 기반 ESG 평가로 신뢰받는 기업으로 성장하세요.
        </p>
        <button onClick={handleClick} className={styles.ctaBtn}>
          무료 평가 시작하기
        </button>
      </div>

      {/* ✅ Features Section */}
      <section className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}><img src={icon1} className={styles.icon} alt="" /></div>
          <h3 className={styles.featureTitle}>데이터 기반</h3>
          <p>실시간 ESG 데이터 수집 및 분석</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}><img src={icon2} className={styles.icon} alt="" /></div>
          <h3 className={styles.featureTitle}>지속 가능성</h3>
          <p>환경 중심의 기업 가치 강화</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}><img src={icon3} className={styles.icon} alt="" /></div>
          <h3 className={styles.featureTitle}>신뢰성</h3>
          <p>다양한 기업들의 검증된 파트너</p>
        </div>
      </section>

      {/* ✅ Stats Section */}
      <section
        ref={statsRef}
        className={`${styles.stats} ${isVisible ? styles.bannerShow : styles.bannerHidden}`}
      >
        <div>
          <div className={styles.statNumber}>200+</div>
          <div className={styles.statLabel}>참여 기업</div>
        </div>
        <div>
          <div className={styles.statNumber}>30%</div>
          <div className={styles.statLabel}>탄소 절감</div>
        </div>
        <div>
          <div className={styles.statNumber}>95%</div>
          <div className={styles.statLabel}>고객 만족도</div>
        </div>
      </section>

      {/* ✅ 중간 배너 (main_esg2) */}
      <section className={styles.banner}>
        <img src={main_esg2} alt="탄소배출량 측정" className={styles.bannerImg} />
        <div className={styles.overlay}>
          <h2 className={styles.subText}>
            정확하고 신뢰할 수 있는<br />
            탄소배출량 측정 서비스를 경험하세요
          </h2>
          <button onClick={handleClick2}>무료 체험 신청</button>
        </div>
      </section>

      {/* 🔽 스크롤 FAB */}
      <button
        type="button"
        onClick={handleFabClick}
        className={`${styles.scrollFab} ${!isHalfOrBelow ? styles.scrollFabUp : ""} ${fabHidden ? styles.scrollFabHidden : ""}`}
        aria-label={isHalfOrBelow ? "아래로 이동" : "위로 이동"}
        title={isHalfOrBelow ? "아래로 이동" : "위로 이동"}
      >
        {/* 아래 화살표. 위로 모드일 때 CSS 회전 */}
        <svg className={styles.scrollFabIcon} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 16a1 1 0 0 1-.7-.29l-5-5a1 1 0 1 1 1.4-1.42L12 13.59l4.3-4.3a1 1 0 0 1 1.4 1.42l-5 5A1 1 0 0 1 12 16z"/>
        </svg>
      </button>
    </div>
  );
}

export default Home;
