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

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/assessment");
  };
   const handleClick2 = () => {
    navigate("/carbon");
  };

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

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

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
          <div className={styles.featureIcon}><img src={icon1} className={styles.icon}/></div>
          <h3 className={styles.featureTitle}>데이터 기반</h3>
          <p>실시간 ESG 데이터 수집 및 분석</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}><img src={icon2} className={styles.icon}/></div>
          <h3 className={styles.featureTitle}>지속 가능성</h3>
          <p>환경 중심의 기업 가치 강화</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}><img src={icon3} className={styles.icon}/></div>
          <h3 className={styles.featureTitle}>신뢰성</h3>
          <p>다양한 기업들의 검증된 파트너</p>
        </div>
      </section>

      {/* ✅ Stats Section */}
      <section
        ref={statsRef}
        className={`${styles.stats} ${
          isVisible ? styles.bannerShow : styles.bannerHidden
        }`}
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

      {/* ✅ 중간 배너 (main_esg2, 문구 수정) */}
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
    </div>
  );
}

export default Home;
