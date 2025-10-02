// frontend/src/pages/ESG_Report.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/ESG_Report.css";

const API_BASE = "https://trueesg.duckdns.org/esg";

function getAuthHeaders() {
  const userKey =
    (typeof window !== "undefined" && sessionStorage.getItem("userKey")) ||
    (typeof window !== "undefined" && localStorage.getItem("userKey"));
  return {
    "Content-Type": "application/json",
    ...(userKey ? { Authorization: `Bearer ${userKey}` } : {}),
  };
}

export default function ESG_Report() {
  const navigate = useNavigate();
  const { year } = useParams();
  const numYear = useMemo(() => Number(year), [year]);

  const [subs, setSubs] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [errorList, setErrorList] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoadingList(true);
        setErrorList("");
        const res = await fetch(`${API_BASE}/submissions/me`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "제출 이력을 불러오지 못했습니다.");
        setSubs(Array.isArray(data.submissions) ? data.submissions : []);
      } catch (e) {
        setErrorList(e.message || "제출 이력을 불러오지 못했습니다.");
      } finally {
        setLoadingList(false);
      }
    })();
  }, []);

  const subsOfYear = useMemo(() => {
    return subs.filter((s) => Number(s.year) === numYear);
  }, [subs, numYear]);

  return (
    <div className="esg-report-page">
      <div className="report-container">
        {/* ← 뒤로가기 버튼 */}
        <button
          className="page-back-btn"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
          title="뒤로가기"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M15 12H6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M10 7l-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* 상단 헤더 */}
        <div className="history-head">
          <h2 className="history-title">
            <span className="title-text">ESG 평가 결과</span>
            <span className="year-chip">
              <span className="year-dot" aria-hidden="true" />
              {year}
            </span>
          </h2>
          <p className="history-help">행을 클릭하면 상세 결과 페이지로 이동합니다.</p>
        </div>

        {/* 본문: 연도별 제출 테이블 */}
        <div className="report-history">
          <h3 className="subhead">{year}년 제출 이력</h3>

          {loadingList ? (
            <p className="loading">불러오는 중…</p>
          ) : errorList ? (
            <div className="user-report-card user-report-card--error">
              <p>⚠️ {errorList}</p>
              <div className="user-report-actions">
                <button className="btn btn--ghost" onClick={() => window.location.reload()}>
                  새로고침
                </button>
              </div>
            </div>
          ) : subsOfYear.length === 0 ? (
            <p className="muted">{year}년에 해당하는 제출 이력이 없습니다.</p>
          ) : (
            <div className="user-report-table-wrap">
              <table className="user-report-table">
                <thead>
                  <tr>
                    <th>제출ID</th>
                    <th>제출일시</th>
                  </tr>
                </thead>
                <tbody>
                  {subsOfYear.map((s, idx) => {
                    const sid = s.id ?? s.submission_id ?? null;
                    const dt = s.inputdate ? new Date(s.inputdate) : null;
                    const dtText = dt && !isNaN(dt.getTime()) ? dt.toLocaleString() : s.inputdate || "";
                    const rowKey = sid ? String(sid) : `no-id-${s.year}-${s.inputdate}-${idx}`;
                    const isDisabled = !sid;

                    return (
                      <tr
                        key={rowKey}
                        className={`row-link ${isDisabled ? "row-disabled" : ""}`}
                        style={{ cursor: isDisabled ? "not-allowed" : "pointer", opacity: isDisabled ? 0.6 : 1 }}
                        title={isDisabled ? "구버전 데이터(상세 이동 불가)" : "클릭해서 상세 결과 보기"}
                        onClick={() => {
                          if (isDisabled) return;
                          navigate(`/ESG_report/${year}/submission/${sid}`);
                        }}
                      >
                        <td className="col-id" data-label="제출ID">
                          <span className="id-badge">{sid ?? "(구버전)"}</span>
                        </td>
                        <td className="col-date" data-label="제출일시">
                          <span className="date-text">{dtText}</span>
                          <span className="row-arrow" aria-hidden="true">→</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
