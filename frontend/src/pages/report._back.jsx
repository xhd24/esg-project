// src/pages/report._back.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import "./css/report.back.css";

// 이미지 파일을 import
import hero2025 from "../assets/images/aa2_2025.png";
import card2024 from "../assets/images/aa2_2024.png";
import card2023 from "../assets/images/aa2_2023.png";

export default function ReportBack() {
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 모달 상태
  const [modal, setModal] = useState(null);

  /**
   * 로그인 체크 함수
   * - 원하는 목적지(to)를 넘기면, 비로그인 시 로그인 페이지로 이동하면서 state.from에 그 목적지를 저장
   * - to가 없으면 현재 페이지(location.pathname + search)를 저장
   */
  const ensureLogin = useCallback(
    (to) => {
      const loggedIn = sessionStorage.getItem("isLogin") === "true";
      if (loggedIn) return true;

      const fallbackFrom = location.pathname + location.search;

      setModal({
        title: "로그인이 필요합니다",
        message: "ESG 리포트를 확인하려면 로그인해 주세요.",
        actions: [
          {
            label: "이동",
            variant: "primary",
            onClick: () => {
              setModal(null);
              navigate("/login", {
                state: { from: to || fallbackFrom },
              });
            },
          },
        ],
      });
      return false;
    },
    [navigate, location]
  );

  // 진입 시 한 번 체크 (여기서는 /report 로 복귀)
  useEffect(() => {
    ensureLogin(); // from = 현재(/report)
  }, [ensureLogin]);

  // 각 카드/링크 클릭 가드 (연도별 목적지를 from 으로 저장)
  const guardTo = (to) => (e) => {
    if (!ensureLogin(to)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="rb-page">
      <div className="rb-container">
        <h2 className="rb-title">ESG Reports</h2>

        {/* 상단 큰 카드 (1000 x 450) */}
        <div className="rb-hero">
          <img
            className="rb-cover"
            src={hero2025}
            alt="2025 ESG Report"
            width="1000"
            height="450"
          />
          {/* 전체 클릭 영역 (로그인 가드) */}
          <Link
            to="/report/2025"
            className="rb-btn"
            aria-label="2025 보고서로 이동"
            onClick={guardTo("/report/2025")}
          />
          {/* 필요 시 텍스트 오버레이 */}
          <div className="rb-center" />
        </div>

        {/* 아래 2개 (492 x 250) */}
        <div className="rb-row">
          <div className="rb-card">
            <img
              className="rb-cover"
              src={card2024}
              alt="2024 ESG Report"
              width="492"
              height="250"
            />
            <Link
              to="/report/2024"
              className="rb-btn"
              aria-label="2024 보고서로 이동"
              onClick={guardTo("/report/2024")}
            />
            <div className="rb-center" />
          </div>

          <div className="rb-card">
            <img
              className="rb-cover"
              src={card2023}
              alt="2023 ESG Report"
              width="492"
              height="250"
            />
            <Link
              to="/report/2023"
              className="rb-btn"
              aria-label="2023 보고서로 이동"
              onClick={guardTo("/report/2023")}
            />
            <div className="rb-center" />
          </div>
        </div>
      </div>

      {/* 모달 (공통 스타일 사용) */}
      {modal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3 className="modal-title">{modal.title}</h3>
            <p className="modal-message">{modal.message}</p>
            <div className="modal-actions">
              {modal.actions?.map((a, idx) => (
                <button
                  key={idx}
                  className={`alert-btn ${
                    a.variant === "primary"
                      ? "alert-btn--primary"
                      : "alert-btn--ghost"
                  }`}
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
