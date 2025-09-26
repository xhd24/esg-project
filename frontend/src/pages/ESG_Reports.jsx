import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/ESG_Reports.css";

// 이미지 불러오기
import report2025 from "../assets/images/2025_ESG_REPORT.png"; // 1000 x 450px
import report2024 from "../assets/images/2024_ESG_REPORT2.png"; // 492 x 250px
import report2023 from "../assets/images/2023_ESG_REPORT2.png"; // 492 x 250px

const API_BASE = "http://localhost:3000/esg";

function ESG_Reports() {
  const navigate = useNavigate();

  // 로그인 사용자 리포트 스냅샷 상태
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/report/me`, {
          headers: { "x-user-id": userId },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "리포트를 불러오지 못했습니다.");
        setReport(data.report || []);
      } catch (e) {
        setError(e.message || "리포트를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  return (
    <div className="reports-container">
      <h2 className="reports-title">ESG Reports</h2>

      {/* === 사용자 리포트 스냅샷 영역 === */}
      <div className="user-report-wrapper">
        {!userId ? (
          <div className="user-report-card user-report-card--ghost">
            <div className="user-report-header">
              <h3>내 ESG 리포트 스냅샷</h3>
            </div>
            <p className="user-report-message">
              리포트 스냅샷을 보려면 로그인이 필요합니다.
            </p>
            <div className="user-report-actions">
              <button className="btn btn--primary" onClick={() => navigate("/login")}>
                로그인 하러가기
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="user-report-card">
            <div className="user-report-header">
              <h3>내 ESG 리포트 스냅샷</h3>
            </div>
            <p className="user-report-message">불러오는 중…</p>
          </div>
        ) : error ? (
          <div className="user-report-card user-report-card--error">
            <div className="user-report-header">
              <h3>내 ESG 리포트 스냅샷</h3>
            </div>
            <p className="user-report-message">⚠️ {error}</p>
            <div className="user-report-actions">
              <button className="btn btn--ghost" onClick={() => window.location.reload()}>
                새로고침
              </button>
            </div>
          </div>
        ) : (
          <div className="user-report-card">
            <div className="user-report-header">
              <h3>내 ESG 리포트 스냅샷</h3>
              <div className="user-report-actions">
                <button className="btn btn--ghost" onClick={() => navigate("/assessment")}>
                  설문 계속하기
                </button>
                <button className="btn btn--primary" onClick={() => navigate("/ESG_report_2025")}>
                  상세 리포트 보기
                </button>
              </div>
            </div>

            <div className="user-report-table-wrap">
              <table className="user-report-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Yes</th>
                    <th>No</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(report || []).map((r) => (
                    <tr key={r.category}>
                      <td>{r.category}</td>
                      <td>{r.yes}</td>
                      <td>{r.no}</td>
                      <td>{r.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 요약 배지 */}
            <div className="user-report-badges">
              {(report || []).map((r) => {
                const answered = r.yes + r.no;
                const pct = r.total ? Math.round((r.yes / r.total) * 100) : 0;
                return (
                  <div key={r.category} className="user-report-badge">
                    <div className="badge-title">{r.category}</div>
                    <div className="badge-sub">
                      응답 {answered}/{r.total} · 예 {pct}% 
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* === /사용자 리포트 스냅샷 영역 === */}

      {/* 기존 이미지 카드 그리드 */}
      <div className="reports-grid">
        {/* 2025 ESG Report */}
        <div className="reports-card" onClick={() => navigate("/ESG_report_2025")}>
          <img
            src={report2025}
            alt="2025 ESG Report"
            className="reports-image-2025"
          />
        </div>

        {/* 2024 ESG Report */}
        <div className="reports-card" onClick={() => navigate("/ESG_report_2024")}>
          <img
            src={report2024}
            alt="2024 ESG Report"
            className="reports-image-small"
          />
        </div>

        {/* 2023 ESG Report */}
        <div className="reports-card" onClick={() => navigate("/ESG_report_2023")}>
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
