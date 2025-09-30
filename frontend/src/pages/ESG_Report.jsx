// frontend/src/pages/ESG_Report.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/ESG_Report.css";

const API_BASE = "http://localhost:3000/esg";

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
        <h2>ESG 평가 결과</h2>

        <div className="report-history" style={{ marginTop: 8 }}>
          <h3>{year}년 제출 이력</h3>

          {loadingList ? (
            <p>불러오는 중…</p>
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
            <p>{year}년에 해당하는 제출 이력이 없습니다.</p>
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
                    const dtText =
                      dt && !isNaN(dt.getTime()) ? dt.toLocaleString() : s.inputdate || "";
                    const rowKey = sid ? String(sid) : `no-id-${s.year}-${s.inputdate}-${idx}`;
                    const isDisabled = !sid;

                    return (
                      <tr
                        key={rowKey}
                        className={isDisabled ? "row-disabled" : ""}
                        style={{ cursor: isDisabled ? "not-allowed" : "pointer", opacity: isDisabled ? 0.6 : 1 }}
                        title={isDisabled ? "구버전 데이터(상세 이동 불가)" : "클릭해서 상세 결과 보기"}
                        onClick={() => {
                          if (isDisabled) return;
                          navigate(`/ESG_report/${year}/submission/${sid}`);
                        }}
                      >
                        <td>{sid ?? "(구버전)"}</td>
                        <td>{dtText}</td>
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
