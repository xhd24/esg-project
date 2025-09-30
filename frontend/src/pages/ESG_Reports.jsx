// frontend/src/pages/ESG_Reports.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/ESG_Reports.css";

// 이미지
import report2025 from "../assets/images/2025_ESG_REPORT.png"; // 1000x450
import report2024 from "../assets/images/2024_ESG_REPORT2.png"; // 492x250
import report2023 from "../assets/images/2023_ESG_REPORT2.png"; // 492x250

export default function ESG_Reports() {
  const navigate = useNavigate();

  return (
    <div className="reports-container">
      <h2 className="reports-title">ESG Reports</h2>

      {/* 이미지 카드 그리드 */}
      <div className="reports-grid">
        {/* 2025 ESG Report */}
        <div className="reports-card" onClick={() => navigate("/ESG_report/2025")}>
          <img src={report2025} alt="2025 ESG Report" className="reports-image-2025" />
        </div>

        {/* 2024 ESG Report */}
        <div className="reports-card" onClick={() => navigate("/ESG_report/2024")}>
          <img src={report2024} alt="2024 ESG Report" className="reports-image-small" />
        </div>

        {/* 2023 ESG Report */}
        <div className="reports-card" onClick={() => navigate("/ESG_report/2023")}>
          <img src={report2023} alt="2023 ESG Report" className="reports-image-small" />
        </div>
      </div>
    </div>
  );
}
