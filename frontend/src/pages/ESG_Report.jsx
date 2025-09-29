import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./css/ESG_Report_2025.css"; // 기존 스타일 재사용

const API_BASE = "http://localhost:3000/esg";
const cats = ["Environment", "Social", "Governance"];
const weights = { Environment: 35, Social: 35, Governance: 30 };

function getAuthHeaders() {
  const userKey =
    (typeof window !== "undefined" && sessionStorage.getItem("userKey")) ||
    (typeof window !== "undefined" && localStorage.getItem("userKey"));
  return {
    "Content-Type": "application/json",
    ...(userKey ? { Authorization: `Bearer ${userKey}` } : {}),
  };
}

function ESG_Report() {
  const { year: yearParam } = useParams(); // /ESG_report/:year

  // 제출 이력
  const [submissions, setSubmissions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(true);
  const [subsError, setSubsError] = useState("");

  // 선택 상태
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);

  // 보고서 데이터
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [reportRow, setReportRow] = useState(null); // { [cat]: { yes, no, total } }
  const [savedAt, setSavedAt] = useState(null);

  // 연도별 그룹
  const subsByYear = useMemo(() => {
    const m = new Map();
    for (const s of submissions) {
      const y = s.year;
      if (!m.has(y)) m.set(y, []);
      m.get(y).push(s);
    }
    // 최신일자 순서 유지(백엔드가 DESC로 줌)
    return m;
  }, [submissions]);

  // 제출 이력 불러오기
  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        setSubsLoading(true);
        setSubsError("");
        const res = await fetch(`${API_BASE}/submissions/me`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "제출 이력을 불러오지 못했습니다.");
        if (!aborted) setSubmissions(Array.isArray(data.submissions) ? data.submissions : []);
      } catch (e) {
        if (!aborted) setSubsError(e?.message || "제출 이력을 불러오지 못했습니다.");
      } finally {
        if (!aborted) setSubsLoading(false);
      }
    })();
    return () => (aborted = true);
  }, []);

  // 초기 선택 로직: URL의 year가 있으면 그 해의 최신 제출, 없으면 가장 최신 연도의 최신 제출
  useEffect(() => {
    if (subsLoading || submissions.length === 0) return;

    const availableYears = Array.from(new Set(submissions.map(s => s.year))); // 내림차순(백엔드 DESC)
    const initialYear = yearParam ? Number(yearParam) : availableYears[0];

    const yearList = submissions.filter(s => s.year === initialYear);
    const initialSubmissionId = yearList[0]?.id ?? null;

    setSelectedYear(initialYear || null);
    setSelectedSubmissionId(initialSubmissionId);
  }, [subsLoading, submissions, yearParam]);

  // 보고서 불러오기
  useEffect(() => {
    if (!selectedYear && !selectedSubmissionId) return;
    let aborted = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const qs = new URLSearchParams();
        if (selectedSubmissionId) qs.set("id", selectedSubmissionId);
        else if (selectedYear) qs.set("year", selectedYear);

        const res = await fetch(`${API_BASE}/report/me?${qs.toString()}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "리포트를 불러올 수 없습니다.");
        if (!Array.isArray(data?.report)) throw new Error("리포트 형식이 올바르지 않습니다.");

        // 카테고리별 정리
        const row = {};
        for (const r of data.report) {
          row[r.category] = {
            yes: Number(r.yes || 0),
            no: Number(r.no || 0),
            total: Number(r.total || 0),
          };
        }

        if (!aborted) {
          setReportRow(row);
          setSavedAt(data?.savedAt || null);
        }
      } catch (e) {
        if (!aborted) setErr(e?.message || "리포트를 불러오는 중 오류가 발생했습니다.");
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => (aborted = true);
  }, [selectedYear, selectedSubmissionId]);

  // 점수 계산
  const yesCounts = useMemo(() => {
    if (!reportRow) return null;
    return Object.fromEntries(cats.map(c => [c, reportRow[c]?.yes || 0]));
  }, [reportRow]);
  const noCounts = useMemo(() => {
    if (!reportRow) return null;
    return Object.fromEntries(cats.map(c => [c, reportRow[c]?.no || 0]));
  }, [reportRow]);
  const totals = useMemo(() => {
    if (!reportRow) return null;
    return Object.fromEntries(cats.map(c => [c, reportRow[c]?.total || 0]));
  }, [reportRow]);
  const scores = useMemo(() => {
    if (!totals || !yesCounts) return null;
    const s = {};
    cats.forEach(c => {
      const t = totals[c] || 0;
      const y = yesCounts[c] || 0;
      const w = weights[c] || 0;
      s[c] = t > 0 ? (y / t) * w : 0;
    });
    s.total = (s.Environment || 0) + (s.Social || 0) + (s.Governance || 0);
    return s;
  }, [yesCounts, totals]);

  const to2 = (n) => Number(n || 0).toFixed(2);
  const pct = (yes, total) => (total > 0 ? ((yes / total) * 100).toFixed(1) : "0.0");

  // 특정 연도 선택 시 그 해의 최신 제출로 전환
  const handleSelectYear = (y) => {
    setSelectedYear(y);
    const yearList = submissions.filter(s => s.year === y);
    setSelectedSubmissionId(yearList[0]?.id ?? null);
  };

  // 제출 행 클릭 시 해당 제출로 전환(페이지 이동 없음)
  const handleClickSubmission = (row) => {
    setSelectedYear(row.year);
    setSelectedSubmissionId(row.id);
  };

  return (
    <div className="report-container">
      <h2>ESG 평가 결과 {selectedYear ? `(${selectedYear})` : ""}</h2>

      {/* === 상단: 년도 선택 & 제출 이력 테이블 === */}
      <div className="user-report-card" style={{ marginBottom: 16 }}>
        <div className="user-report-header">
          <h3>제출 이력</h3>
        </div>

        {subsLoading ? (
          <p className="user-report-message">제출 이력을 불러오는 중…</p>
        ) : subsError ? (
          <p className="user-report-message">⚠️ {subsError}</p>
        ) : submissions.length === 0 ? (
          <p className="user-report-message">아직 제출 이력이 없습니다.</p>
        ) : (
          <>
            {/* 연도 선택 버튼들 */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {Array.from(subsByYear.keys()).map((y) => (
                <button
                  key={y}
                  className={`btn ${selectedYear === y ? "btn--primary" : "btn--ghost"}`}
                  onClick={() => handleSelectYear(y)}
                >
                  {y}
                </button>
              ))}
            </div>

            {/* 선택된 연도의 제출 테이블 */}
            <div className="user-report-table-wrap">
              <table className="user-report-table">
                <thead>
                  <tr>
                    <th style={{ width: 120 }}>Year</th>
                    <th>Submitted At</th>
                    <th style={{ width: 160 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(subsByYear.get(selectedYear) || []).map((s) => (
                    <tr
                      key={s.id}
                      className="clickable-row"
                      onClick={() => handleClickSubmission(s)}
                      title="클릭하여 이 제출의 결과 보기"
                    >
                      <td>{s.year}</td>
                      <td>{new Date(s.inputdate).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn--primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClickSubmission(s);
                          }}
                        >
                          결과 보기
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="user-report-hint">원하는 행을 클릭하면 아래 결과 카드가 갱신됩니다.</p>
            </div>
          </>
        )}
      </div>
      {/* === /제출 이력 === */}

      {/* === 결과 카드 === */}
      {loading ? (
        <p>리포트를 불러오는 중…</p>
      ) : err ? (
        <p>⚠️ {err}</p>
      ) : !reportRow ? (
        <p>결과가 없습니다. 먼저 ESG 평가를 제출해주세요.</p>
      ) : (
        <>
          {savedAt ? <p>저장 시각: {new Date(savedAt).toLocaleString()}</p> : null}

          <div className="report-cards">
            {/* 총점 카드 */}
            <div className="report-detail-card">
              <h3>총점</h3>
              <div className="total-score">{to2(scores.total)} / 100</div>
              <small>
                E {to2(scores.Environment)} / S {to2(scores.Social)} / G {to2(scores.Governance)}
              </small>
            </div>

            {/* E */}
            <div className="report-detail-card">
              <h3>Environment</h3>
              <div className="score">{to2(scores.Environment)} / {weights.Environment}</div>
              <div>
                예: <b>{yesCounts.Environment}</b> / {totals.Environment} (
                {pct(yesCounts.Environment, totals.Environment)}%)
              </div>
              <div>아니오(또는 미응답): {noCounts.Environment}</div>
            </div>

            {/* S */}
            <div className="report-detail-card">
              <h3>Social</h3>
              <div className="score">{to2(scores.Social)} / {weights.Social}</div>
              <div>
                예: <b>{yesCounts.Social}</b> / {totals.Social} (
                {pct(yesCounts.Social, totals.Social)}%)
              </div>
              <div>아니오(또는 미응답): {noCounts.Social}</div>
            </div>

            {/* G */}
            <div className="report-detail-card">
              <h3>Governance</h3>
              <div className="score">{to2(scores.Governance)} / {weights.Governance}</div>
              <div>
                예: <b>{yesCounts.Governance}</b> / {totals.Governance} (
                {pct(yesCounts.Governance, totals.Governance)}%)
              </div>
              <div>아니오(또는 미응답): {noCounts.Governance}</div>
            </div>
          </div>

          {/* ✅ 하단 결과 카드 영역 (기존 틀 유지) */}
          <div className="report-bottom">
            <div className="report-bottom-card">
              <h4 className="report-bottom-title">결과 A</h4>
              <div className="report-bottom-body">여기에 A 결과/지표/차트 등을 표시</div>
            </div>
            <div className="report-bottom-card">
              <h4 className="report-bottom-title">결과 B</h4>
              <div className="report-bottom-body">여기에 B 결과/지표/차트 등을 표시</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ESG_Report;
