// src/pages/report._back.jsx
import { Link } from "react-router-dom";
import "./css/report.back.css";

// 이미지 파일을 import
import hero2025 from "../assets/images/aa2_2025.png";
import card2024 from "../assets/images/aa2_2024.png";
import card2023 from "../assets/images/aa2_2023.png";

export default function ReportBack() {
  return (
    <div className="rb-page">
      <div className="rb-container">
        <h2 className="rb-title">ESG Reports</h2>

        {/* 상단 큰 카드 (1000 x 450) */}
        <div className="rb-hero">
          <img className="rb-cover" src={hero2025} alt="2025 ESG Report" width="1000" height="450" />
          <Link to="/report/2025" className="rb-btn" aria-label="2025 보고서로 이동" />
          <div className="rb-center">
            
          </div>
         
        </div>

        {/* 아래 2개 (492 x 250) */}
        <div className="rb-row">
          <div className="rb-card">
            <img className="rb-cover" src={card2024} alt="2024 ESG Report" width="492" height="250" />
            <Link to="/report/2024" className="rb-btn" aria-label="2024 보고서로 이동" />
            <div className="rb-center">
             
            </div>
           
          </div>

          <div className="rb-card">
            <img className="rb-cover" src={card2023} alt="2023 ESG Report" width="492" height="250" />
            <Link to="/report/2023" className="rb-btn" aria-label="2023 보고서로 이동" />
            <div className="rb-center">
             
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
