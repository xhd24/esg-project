import React, { useEffect, useState } from "react";
import "./css/ESG_Report.css";  // CSS 불러오기

const REPORT_KEY = "ESG_REPORT_V1";

function ESG_Report() {
    const [report, setReport] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem(REPORT_KEY);
        if (saved) {
            try {
                setReport(JSON.parse(saved));
            } catch {
                setReport(null);
            }
        }
    }, []);

    if (!report) {
        return (
            <div className="report-container">
                <h2>ESG 평가 결과</h2>
                <p>아직 저장된 결과가 없습니다. 먼저 <b>ESG 평가</b>에서 제출해주세요.</p>
            </div>
        );
    }

    const { scores, yesCounts, noCounts, totals, weights, savedAt } = report;

    const to2 = (n) => Number(n).toFixed(2);
    const pct = (yes, total) =>
        total > 0 ? ((yes / total) * 100).toFixed(1) : "0.0";

    return (
        <div className="report-container">
            <h2>ESG 평가 결과</h2>
            <p>저장 시각: {new Date(savedAt).toLocaleString()}</p>

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
                        예: <b>{yesCounts.Environment}</b> / {totals.Environment} ({pct(yesCounts.Environment, totals.Environment)}%)
                    </div>
                    <div>아니오(또는 미응답): {noCounts.Environment}</div>
                </div>

                {/* S */}
                <div className="report-detail-card">
                    <h3>Social</h3>
                    <div className="score">{to2(scores.Social)} / {weights.Social}</div>
                    <div>
                        예: <b>{yesCounts.Social}</b> / {totals.Social} ({pct(yesCounts.Social, totals.Social)}%)
                    </div>
                    <div>아니오(또는 미응답): {noCounts.Social}</div>
                </div>

                {/* G */}
                <div className="report-detail-card">
                    <h3>Governance</h3>
                    <div className="score">{to2(scores.Governance)} / {weights.Governance}</div>
                    <div>
                        예: <b>{yesCounts.Governance}</b> / {totals.Governance} ({pct(yesCounts.Governance, totals.Governance)}%)
                    </div>
                    <div>아니오(또는 미응답): {noCounts.Governance}</div>
                </div>
            </div>
        </div>
    );
}

export default ESG_Report;
