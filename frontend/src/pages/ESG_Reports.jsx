import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/ESG_Reports.css";

function ESG_Reports() {
    const navigate = useNavigate();

    return (
        <div className="reports-container">
            <h2 className="reports-title">ESG Reports</h2>

            <div className="reports-grid">
                {/* 2025 ESG Report */}
                <div className="reports-card" onClick={() => navigate("/ESG_report")}>
                    <div className="reports-image-placeholder_2025">이미지 공간</div>
                    <h3>2025 ESG Report</h3>
                    
                </div>

                {/* 2024 ESG Report */}
                <div className="reports-card">
                    <div className="reports-image-placeholder-small">이미지 공간</div>
                    <h3>2024 ESG Report</h3>
                    
                </div>

                {/* 2023 ESG Report */}
                <div className="reports-card">
                    <div className="reports-image-placeholder-small">이미지 공간</div>
                    <h3>2023 ESG Report</h3>
                    
                </div>
            </div>
        </div>
    );
}

export default ESG_Reports;
