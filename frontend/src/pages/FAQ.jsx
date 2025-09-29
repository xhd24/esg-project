// src/pages/FAQ.jsx
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./css/FAQ.module.css";

function FAQ() {
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = "/faq";

  // 모달 상태
  const [modal, setModal] = useState(null);

  // 공통: 로그인 확인 (+ 돌아올 곳 저장)
  const ensureLogin = (redirectPath = location.pathname) => {
    const loggedIn = sessionStorage.getItem("isLogin") === "true";
    if (loggedIn) return true;

    // 로그인 성공 후 돌아올 경로 저장
    sessionStorage.setItem("postLoginRedirect", redirectPath);

    setModal({
      title: "로그인이 필요합니다",
      message: "문의 내역/등록 기능을 이용하려면 로그인해 주세요.",
      actions: [
        {
          label: "이동",
          variant: "primary",
          onClick: () => {
            setModal(null);
            navigate("/login", { state: { from: redirectPath }, replace: true });
          },
        },
      ],
    });
    return false;
  };

  // 페이지 진입 시 1회 확인
  useEffect(() => {
    // 현재 페이지로 복귀할 수 있도록 현재 경로 저장
    ensureLogin(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 탭(링크) 클릭 가드: 클릭한 탭으로 복귀하도록 경로 넘김
  const guardClick = (e, redirectPath) => {
    if (!ensureLogin(redirectPath)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link
          to=""
          onClick={(e) => guardClick(e, basePath)}
          className={`${styles.link} ${location.pathname === basePath ? styles.active : ""}`}
        >
          문의 내역
        </Link>

        <Link
          to="write"
          onClick={(e) => guardClick(e, `${basePath}/write`)}
          className={`${styles.link} ${location.pathname === `${basePath}/write` ? styles.active : ""}`}
        >
          문의하기
        </Link>
      </nav>

      <Outlet />

      {/* 로그인 안내 모달 (사이트 공통 스타일 재사용) */}
      {modal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3 className="modal-title">{modal.title}</h3>
            <p className="modal-message">{modal.message}</p>
            <div className="modal-actions">
              {modal.actions?.map((a, idx) => (
                <button
                  key={idx}
                  className={`alert-btn ${a.variant === "primary" ? "alert-btn--primary" : "alert-btn--ghost"}`}
                  onClick={a.onClick}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FAQ;
