// src/pages/ESG_Reports.jsx
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ESG_Reports.css";

// 이미지 불러오기
import report2025 from "../assets/images/2025_ESG_REPORT.png";   // 1000 x 450px
import report2024 from "../assets/images/2024_ESG_REPORT2.png"; // 492 x 250px
import report2023 from "../assets/images/2023_ESG_REPORT2.png"; // 492 x 250px

function ESG_Reports() {
  const navigate = useNavigate();

  // 로그인 모달 상태
  const [modal, setModal] = useState(null);

  /**
   * 로그인 여부 확인.
   * - 미로그인 시 postLoginRedirect를 목적지로 저장하고 로그인 페이지로 유도하는 모달(이동 버튼만) 표시
   * - targetPath가 없으면 현재 리스트 페이지("/ESG_reports")로 복귀하도록 설정
   */
  const ensureLogin = useCallback(
    (targetPath = "/ESG_reports") => {
      const loggedIn = sessionStorage.getItem("isLogin") === "true";
      if (loggedIn) return true;

      // 로그인 성공 후 돌아올 목적지 저장
      sessionStorage.setItem("postLoginRedirect", targetPath);

      // 모달 노출 (이동 버튼만)
      setModal({
        title: "로그인이 필요합니다",
        message: "ESG 리포트를 확인하려면 로그인해 주세요.",
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

  // 페이지 진입 시 1회 체크: 리스트 자체도 비공개라면 유지,
  // 공개하고 싶다면 이 useEffect 제거하세요.
  useEffect(() => {
    ensureLogin("/ESG_reports");
  }, [ensureLogin]);

  // 카드 클릭 가드: 각 연도 상세로 이동 시도 전 로그인 체크 + 목적지 저장
  const goYear = (path) => {
    if (ensureLogin(path)) {
      navigate(path);
    }
  };

  return (
    <div className="reports-container">
      <h2 className="reports-title">ESG Reports</h2>

      <div className="reports-grid">
        {/* 2025 ESG Report */}
        <div
          className="reports-card"
          role="button"
          tabIndex={0}
          onClick={() => goYear("/ESG_report_2025")}
          onKeyDown={(e) => e.key === "Enter" && goYear("/ESG_report_2025")}
        >
          <img
            src={report2025}
            alt="2025 ESG Report"
            className="reports-image-2025"
          />
        </div>

        {/* 2024 ESG Report */}
        <div
          className="reports-card"
          role="button"
          tabIndex={0}
          onClick={() => goYear("/ESG_report_2024")}
          onKeyDown={(e) => e.key === "Enter" && goYear("/ESG_report_2024")}
        >
          <img
            src={report2024}
            alt="2024 ESG Report"
            className="reports-image-small"
          />
        </div>

        {/* 2023 ESG Report */}
        <div
          className="reports-card"
          role="button"
          tabIndex={0}
          onClick={() => goYear("/ESG_report_2023")}
          onKeyDown={(e) => e.key === "Enter" && goYear("/ESG_report_2023")}
        >
          <img
            src={report2023}
            alt="2023 ESG Report"
            className="reports-image-small"
          />
        </div>
      </div>

      {/* 공통 모달 스타일 재사용 */}
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

export default ESG_Reports;
