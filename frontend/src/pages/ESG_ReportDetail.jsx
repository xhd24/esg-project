// frontend/src/pages/ESG_ReportDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/ESG_ReportDetail.css";

const API_BASE = "http://localhost:3000/esg";
const to2 = (n) => Number(n || 0).toFixed(2);
const pct = (yes, total) => (total > 0 ? ((yes / total) * 100).toFixed(1) : "0.0");

function getAuthHeaders() {
  const userKey =
    (typeof window !== "undefined" && sessionStorage.getItem("userKey")) ||
    (typeof window !== "undefined" && localStorage.getItem("userKey"));
  return {
    "Content-Type": "application/json",
    ...(userKey ? { Authorization: `Bearer ${userKey}` } : {}),
  };
}

export default function ESG_ReportDetail() {
  const navigate = useNavigate();
  const { year, sid } = useParams();

  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [errorDetail, setErrorDetail] = useState("");

  const savedAtText = useMemo(() => {
    if (!detail?.savedAt) return "";
    const d = new Date(detail.savedAt);
    return isNaN(d.getTime()) ? String(detail.savedAt) : d.toLocaleString();
  }, [detail?.savedAt]);

  useEffect(() => {
    (async () => {
      try {
        setLoadingDetail(true);
        setErrorDetail("");
        const res = await fetch(`${API_BASE}/submissions/${sid}`, { headers: getAuthHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "제출 상세를 불러오지 못했습니다.");
        setDetail(data);
      } catch (e) {
        setErrorDetail(e.message || "제출 상세를 불러오지 못했습니다.");
      } finally {
        setLoadingDetail(false);
      }
    })();
  }, [sid]);

  return (
    <div className="esg-report-detail-page">
      <div className="report-container">
        <div className="detail-topbar">
          <button className="btn-back" onClick={() => navigate(-1)} aria-label="뒤로가기">←</button>
          <h2 className="detail-title">ESG 평가 결과</h2>
          <span />
        </div>

        <div className="detail-subhead">
          <span className="pill"><span className="pill-label">제출 ID</span><span className="pill-value">{sid}</span></span>
          <span className="pill"><span className="pill-label">연도</span><span className="pill-value">{year}</span></span>
        </div>

        {loadingDetail ? (
          <p className="loading">결과 불러오는 중…</p>
        ) : errorDetail ? (
          <div className="alert error">
            <div className="alert-title">오류</div>
            <div>{errorDetail}</div>
            <div className="alert-actions">
              <button className="btn btn--ghost" onClick={() => window.location.reload()}>새로고침</button>
            </div>
          </div>
        ) : !detail ? (
          <p className="muted">선택된 제출이 없습니다.</p>
        ) : (
          <>
            <div className="saved-at">저장 시각: {savedAtText}</div>

            <div className="report-cards">
              <div className="report-detail-card">
                <h3>총점</h3>
                <div className="total-score">{to2(detail.scores.total)} / 100</div>
                <small>
                  E {to2(detail.scores.Environment)} / S {to2(detail.scores.Social)} / G {to2(detail.scores.Governance)}
                </small>
              </div>

              <div className="report-detail-card">
                <h3>Environment</h3>
                <div className="score">
                  {to2(detail.scores.Environment)} / {detail.weights.Environment}
                </div>
                <div>
                  예: <b>{detail.yesCounts.Environment}</b> / {detail.totals.Environment} ({pct(detail.yesCounts.Environment, detail.totals.Environment)}%)
                </div>
                <div>아니오(또는 미응답): {detail.noCounts.Environment}</div>
              </div>

              <div className="report-detail-card">
                <h3>Social</h3>
                <div className="score">
                  {to2(detail.scores.Social)} / {detail.weights.Social}
                </div>
                <div>
                  예: <b>{detail.yesCounts.Social}</b> / {detail.totals.Social} ({pct(detail.yesCounts.Social, detail.totals.Social)}%)
                </div>
                <div>아니오(또는 미응답): {detail.noCounts.Social}</div>
              </div>

              <div className="report-detail-card">
                <h3>Governance</h3>
                <div className="score">
                  {to2(detail.scores.Governance)} / {detail.weights.Governance}
                </div>
                <div>
                  예: <b>{detail.yesCounts.Governance}</b> / {detail.totals.Governance} ({pct(detail.yesCounts.Governance, detail.totals.Governance)}%)
                </div>
                <div>아니오(또는 미응답): {detail.noCounts.Governance}</div>
              </div>
            </div>

            <div className="report-bottom">
              <div className="report-bottom-card">
                <h4 className="report-bottom-title">결과 A</h4>
                <div className="report-bottom-body">해당 제출({sid})의 A 결과/지표/차트 등을 표시</div>
              </div>
              <div className="report-bottom-card">
                <h4 className="report-bottom-title">결과 B</h4>
                <div className="report-bottom-body">해당 제출({sid})의 B 결과/지표/차트 등을 표시</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
