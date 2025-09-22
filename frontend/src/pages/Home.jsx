import { useEffect, useRef, useState } from 'react';
import main_esg from '../assets/images/main_esg.png';
import main_esg2 from '../assets/images/main_esg2.png';
import styles from './css/Home.module.css';

function Home() {
    const textRef = useRef(null);
    const [isTextVisible, setIsTextVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsTextVisible(true);
                        observer.unobserve(entry.target); // 한 번만 실행
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (textRef.current) {
            observer.observe(textRef.current);
        }

        return () => {
            if (textRef.current) {
                observer.unobserve(textRef.current);
            }
        };
    }, []);

    return (
        <div className={styles.container}>
            <img 
                src={main_esg} 
                alt="메인 ESG" 
                className={`${styles.fadeIn} ${styles.imgHover}`} 
            />
            <div className={styles.textbox}>
            <h1 className={`${styles.typing} ${styles.mainText}`}>
                ESG 검증과 탄소배출량 측정을 한 곳에서.<br />
                기업의 지속가능 경영을 실시간으로 모니터링하고 개선하세요.
            </h1>
            </div>

            <div className={styles.banner}>
                <img 
                    src={main_esg2} 
                    alt="ESG 관리" 
                    className={styles.bannerImg} 
                />

                <div className={styles.overlay}>
                    <h1
                        ref={textRef}
                        className={`${styles.subText} ${isTextVisible ? styles.textShow : styles.textHidden}`}
                    >
                        효율적이고 간편한 ESG 대응 및 관리,<br />
                        지금 시작해보세요
                    </h1>
                    <button className={styles.ctaBtn}>무료 평가 시작하기</button>
                </div>
            </div>
        </div>
    );
}

export default Home;
