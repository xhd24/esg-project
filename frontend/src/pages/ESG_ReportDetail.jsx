// frontend/src/pages/ESG_ReportDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
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

  const [companyData, setCompanyData] = useState([]); // 결과 A
  const [weaknessData, setWeaknessData] = useState([]); // 결과 B

  const savedAtText = useMemo(() => {
    if (!detail?.savedAt) return "";
    const d = new Date(detail.savedAt);
    return isNaN(d.getTime()) ? String(detail.savedAt) : d.toLocaleString();
  }, [detail?.savedAt]);

  // 상세 불러오기
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

  // 결과 A (기업별 ESG 점수)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/report/company`, { headers: getAuthHeaders() });
        const data = await res.json();
        if (res.ok) setCompanyData(data.companies || []);
      } catch (e) {
        console.warn("결과 A 불러오기 실패:", e);
      }
    })();
  }, []);

  // 결과 B (취약점 분석)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/report/weakness`, { headers: getAuthHeaders() });
        const data = await res.json();
        if (res.ok) setWeaknessData(data.weaknesses || []);
      } catch (e) {
        console.warn("결과 B 불러오기 실패:", e);
      }
    })();
  }, []);

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

            {/* 기본 점수 카드 */}
            <div className="report-cards">
              <div className="report-detail-card">
                <h3>총점</h3>
                <div className="total-score">{to2(detail.scores.total)} / 100</div>
                <small>
                  E {to2(detail.scores.Environment)} / S {to2(detail.scores.Social)} / G {to2(detail.scores.Governance)}
                </small>
              </div>

              {["Environment", "Social", "Governance"].map(cat => (
                <div key={cat} className="report-detail-card">
                  <h3>{cat}</h3>
                  <div className="score">{to2(detail.scores[cat])} / {detail.weights[cat]}</div>
                  <div>
                    예: <b>{detail.yesCounts[cat]}</b> / {detail.totals[cat]} ({pct(detail.yesCounts[cat], detail.totals[cat])}%)
                  </div>
                  <div>아니오(또는 미응답): {detail.noCounts[cat]}</div>
                </div>
              ))}
            </div>

            {/* 결과 A & B */}
            <div className="report-bottom">
              <div className="report-bottom-card">
                <h4 className="report-bottom-title">결과 A: 기업별 ESG 점수 비교</h4>
                <div className="report-bottom-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={companyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="company" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="score" fill="#0ea5e9" name="총점" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="report-bottom-card">
                <h4 className="report-bottom-title">결과 B: 취약점 분석</h4>
                <div className="report-bottom-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weaknessData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subCategory" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="E" fill="#34d399" name="Environment" />
                      <Bar dataKey="S" fill="#60a5fa" name="Social" />
                      <Bar dataKey="G" fill="#f87171" name="Governance" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
