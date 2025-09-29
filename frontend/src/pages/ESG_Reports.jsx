import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/ESG_Reports.css";

// 이미지 불러오기
import report2025 from "../assets/images/2025_ESG_REPORT.png"; // 1000 x 450px
import report2024 from "../assets/images/2024_ESG_REPORT2.png"; // 492 x 250px
import report2023 from "../assets/images/2023_ESG_REPORT2.png"; // 492 x 250px

function ESG_Reports() {
  const navigate = useNavigate();

  return (
    <div className="reports-container">
      <h2 className="reports-title">ESG Reports</h2>

      {/* 가운데 사용자 스냅샷/로그인 영역 제거 */}

      {/* 연도별 이미지 카드 그리드 (그대로 유지) */}
      <div className="reports-grid">
        {/* 2025 ESG Report */}
        <div className="reports-card" onClick={() => navigate("/ESG_report/2025")}>
          <img
            src={report2025}
            alt="2025 ESG Report"
            className="reports-image-2025"
          />
        </div>

        {/* 2024 ESG Report */}
        <div className="reports-card" onClick={() => navigate("/ESG_report/2024")}>
          <img
            src={report2024}
            alt="2024 ESG Report"
            className="reports-image-small"
          />
        </div>

        {/* 2023 ESG Report */}
        <div className="reports-card" onClick={() => navigate("/ESG_report/2023")}>
          <img
            src={report2023}
            alt="2023 ESG Report"
            className="reports-image-small"
          />
        </div>
      </div>
    </div>
  );
}

export default ESG_Reports;
