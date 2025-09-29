import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./css/Home.module.css";
import main_esg from "../assets/images/main_esg.png";   // Hero 섹션 이미지
import main_esg_1 from "../assets/images/main_esg_1.png";   // Hero 섹션 이미지
import main_esg_2 from "../assets/images/main_esg_2.png";   // Hero 섹션 이미지
// import main_jinwoo from "../assets/images/main_jinwoo.png";   // Hero 섹션 이미지
// import main_jinwoo2 from "../assets/images/main_jinwoo2.png";   // Hero 섹션 이미지
import main_esg2 from "../assets/images/main_esg2.png"; // 중간 배너 이미지

import icon1 from "../assets/images/icon1.png";
import icon2 from "../assets/images/icon2.png";
import icon3 from "../assets/images/icon3.png";

function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);

  // 🔽 FAB용 상태
  const [isHalfOrBelow, setIsHalfOrBelow] = useState(true);
  const [fabHidden, setFabHidden] = useState(false);

  const navigate = useNavigate();
  const handleClick = () => navigate("/assessment");
  const handleClick2 = () => navigate("/carbon");

  // ✅ Hero 배경 슬라이드 (페이드 + 프로그레스바)
  const images = [main_esg, main_esg_1, main_esg_2];
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 5000; // 5초
    const step = 100;

    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += step;
      setProgress((elapsed / duration) * 100);

      if (elapsed >= duration) {
        setActiveIndex((prev) => (prev + 1) % images.length);
        elapsed = 0;
        setProgress(0);
      }
    }, step);

    return () => clearInterval(interval);
  }, [images.length]);

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

  // 🔽 FAB: 스크롤 위치 감지
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
      setFabHidden(docHeight <= winHeight + 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // 🔽 FAB 클릭
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
      {/* ✅ Hero Section (배경 페이드) */}
      <div className={styles.hero}>
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`${styles.bg} ${idx === activeIndex ? styles.active : ""}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}

        {/* ◀ 왼쪽 화살표 */}
        {/* <button
          className={`${styles.arrow} ${styles.left}`}
          onClick={() => {
            setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
            setProgress(0);
          }}
        >
          &#10094;
        </button> */}

        {/* ▶ 오른쪽 화살표 */}
        {/* <button
          className={`${styles.arrow} ${styles.right}`}
          onClick={() => {
            setActiveIndex((prev) => (prev + 1) % images.length);
            setProgress(0);
          }}
        >
          &#10095;
        </button> */}

        {/* 하단 프로그레스 바 */}
        <div className={styles.tabBar}>
          {images.map((_, idx) => (
            <div
              key={idx}
              className={styles.tab}
              onClick={() => {
                setActiveIndex(idx);
                setProgress(0);
              }}
            >
              <div
                className={styles.progress}
                style={{
                  width: idx === activeIndex ? `${progress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ✅ HeroContent (배경 아래 분리) */}
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

      {/* ✅ 중간 배너 */}
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
        <svg className={styles.scrollFabIcon} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 16a1 1 0 0 1-.7-.29l-5-5a1 1 0 1 1 1.4-1.42L12 13.59l4.3-4.3a1 1 0 0 1 1.4 1.42l-5 5A1 1 0 0 1 12 16z" />
        </svg>
      </button>
    </div>
  );
}

export default Home;
