import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";
import "./css/ESG_ReportDetail.css";

const API_BASE = "http://localhost:3000/esg";
const to2 = (n) => Number(n || 0).toFixed(2);
const pct = (yes, total) => {
  const y = Number(yes || 0);
  const t = Number(total || 0);
  return t > 0 ? ((y / t) * 100).toFixed(1) : "0.0";
};

// 점수 퍼센트에 따라 색상 클래스 반환
function toneClass(score, max) {
  const s = Number(score || 0);
  const m = Number(max || 0);
  const p = m > 0 ? (s / m) * 100 : 0;
  if (p >= 80) return "tone--good";
  if (p >= 50) return "tone--warn";
  return "tone--bad";
}

const CATS = ["Environment", "Social", "Governance"];

function getAuthHeaders() {
  const userKey =
    (typeof window !== "undefined" && sessionStorage.getItem("userKey")) ||
    (typeof window !== "undefined" && localStorage.getItem("userKey"));
  return {
    "Content-Type": "application/json",
    ...(userKey ? { Authorization: `Bearer ${userKey}` } : {}),
  };
}

// 회사 이름 -> 색
function colorForCompany(name = "") {
  if (name.includes("삼성중공업")) return "#3b82f6"; // 파란색
  if (name.includes("한화오션")) return "#f59e0b"; // 주황색
  if (name.includes("현대중공업")) return "#10b981"; // 초록색
  return "#94a3b8"; // 기타(회색)
}

export default function ESG_ReportDetail() {
  const navigate = useNavigate();
  const { year, sid } = useParams();

  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [errorDetail, setErrorDetail] = useState("");

  const [companyData, setCompanyData] = useState([]);   // 결과 A
  const [weaknessData, setWeaknessData] = useState([]); // 결과 B

  const savedAtText = useMemo(() => {
    if (!detail?.savedAt) return "";
    const d = new Date(detail.savedAt);
    return isNaN(d.getTime()) ? String(detail.savedAt) : d.toLocaleString("ko-KR");
  }, [detail?.savedAt]);

  // 총점 분모(가중치 합계)
  const maxTotal = useMemo(() => {
    const w = detail?.weights || {};
    const sum =
      Number(w.Environment || 0) +
      Number(w.Social || 0) +
      Number(w.Governance || 0);
    return sum || 100;
  }, [detail?.weights]);

  // 상세 불러오기
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoadingDetail(true);
        setErrorDetail("");
        const res = await fetch(`${API_BASE}/submissions/${sid}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "제출 상세를 불러오지 못했습니다.");
        if (!ignore) setDetail(data);
      } catch (e) {
        if (!ignore) setErrorDetail(e.message || "제출 상세를 불러오지 못했습니다.");
      } finally {
        if (!ignore) setLoadingDetail(false);
      }
    })();
    return () => { ignore = true; };
  }, [sid]);

  // 결과 A (기업별 ESG 점수)
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/report/company`, { headers: getAuthHeaders() });
        const data = await res.json();
        if (res.ok && !ignore) setCompanyData(data?.companies || []);
      } catch (e) {
        console.warn("결과 A 불러오기 실패:", e);
      }
    })();
    return () => { ignore = true; };
  }, []);

  // 결과 B (취약점 분석)
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/report/weakness`, { headers: getAuthHeaders() });
        const data = await res.json();
        if (res.ok && !ignore) setWeaknessData(data?.weaknesses || []);
      } catch (e) {
        console.warn("결과 B 불러오기 실패:", e);
      }
    })();
    return () => { ignore = true; };
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
              {/* 총점 */}
              <div className="report-detail-card">
                <h3>총점</h3>
                <div className={`total-score ${toneClass(detail?.scores?.total, maxTotal)}`}>
                  {to2(detail?.scores?.total)} / {maxTotal}
                </div>
                <small>
                  E {to2(detail?.scores?.Environment)} / S {to2(detail?.scores?.Social)} / G {to2(detail?.scores?.Governance)}
                </small>
              </div>

              {/* E / S / G 공통 렌더링 */}
              {CATS.map((cat) => {
                const score = detail?.scores?.[cat] ?? 0;
                const weight = detail?.weights?.[cat] ?? 0;
                const yes = detail?.yesCounts?.[cat] ?? 0;
                const total = detail?.totals?.[cat] ?? 0;
                const no = detail?.noCounts?.[cat] ?? Math.max(0, Number(total) - Number(yes));
                return (
                  <div key={cat} className="report-detail-card">
                    <h3>{cat}</h3>
                    <div className={`score ${toneClass(score, weight)}`}>
                      {to2(score)} / {weight}
                    </div>
                    <div>
                      예: <b>{yes}</b> / {total} ({pct(yes, total)}%)
                    </div>
                    <div>아니오(또는 미응답): {no}</div>
                  </div>
                );
              })}
            </div>

            {/* 결과 A & B */}
            <div className="report-bottom">
              {/* 결과 A: 회사별 색 + 범례 파랑 */}
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
                      <Bar dataKey="score" name="총점" fill="#22c55e">
                        {companyData.map((d, idx) => (
                          <Cell key={`cell-${idx}`} fill={colorForCompany(d.company)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 결과 B: 범주 색 */}
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
                      <Bar dataKey="E" name="Environment" fill="#22c55e" />
                      <Bar dataKey="S" name="Social" fill="#3b82f6" />
                      <Bar dataKey="G" name="Governance" fill="#a855f7" />
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
