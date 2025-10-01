// src/pages/ESGBack.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "./css/Carb1.css";
import "./css/report.back.css";

export default function ESGBack() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);

  // 로그인 확인 + 모달(이동만) + 리다이렉트 목적지 저장
  const ensureLogin = useCallback(
    (targetPath = "/carbon") => {
      const isLogin = sessionStorage.getItem("isLogin") === "true";
      if (isLogin) return true;

      // 로그인 성공 후 돌아올 목적지 저장
      sessionStorage.setItem("postLoginRedirect", targetPath);

      setModal({
        title: "로그인이 필요합니다",
        message: "탄소배출량 입력을 이용하려면 로그인해 주세요.",
        actions: [
          {
            label: "이동",
            variant: "primary",
            onClick: () => {
              setModal(null);
              navigate("/login", { state: { from: targetPath }, replace: true });
            },
          },
        ],
      });
      return false;
    },
    [navigate]
  );

  useEffect(() => {
    ensureLogin("/carbon");
  }, [ensureLogin]);

  const goForms = () => {
    if (ensureLogin("/carbon/forms")) {
      navigate("/carbon/forms");
    }
  };

  return (
    <div className="carb1-container back-root">
      {/* 뒤로가기 버튼: 무조건 홈으로 */}
      <button
        type="button"
        className="back-btn"
        aria-label="뒤로가기"
        onClick={() => navigate("/", { replace: true })}
      >
        {/* 직선 화살표 아이콘 */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 12H8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M12 7L7 12L12 17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <section className="card">
        <h2 className="section-title">탄소배출량 안내</h2>
        <p>
          여기에서 <strong>내부/외부 공정 배출량</strong>과{" "}
          <strong>운항 배출량</strong> 입력 화면으로 이동할 수 있어요.
        </p>

        <button className="btn-primary" onClick={goForms}>
          입력 시작하기
        </button>
      </section>

      {/* 로그인 유도 모달 */}
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
