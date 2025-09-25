import React, { useEffect, useState } from "react";
import "./css/ESG_Report_2024.css";  // CSS 불러오기

const REPORT_KEY = "ESG_REPORT_V1";

function ESG_Report_2023() {
    const [report, setReport] = useState(null);

    useEffect(() => {
        // ⭐️ localStorage 무시하고 강제로 더미 데이터 세팅
        setReport({
            scores: { total: 75, Environment: 23, Social: 27, Governance: 25 },
            yesCounts: { Environment: 11, Social: 14, Governance: 12 },
            noCounts: { Environment: 4, Social: 8, Governance: 6 },
            totals: { Environment: 15, Social: 22, Governance: 18 },
            weights: { Environment: 35, Social: 35, Governance: 30 },
            savedAt: Date.now(),
        });
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
            {/* ✅ 하단 결과 카드 영역 */}
            <div className="report-bottom">
                <div className="report-bottom-card">
                    <h4 className="report-bottom-title">결과 A</h4>
                    <div className="report-bottom-body">
                        여기에 A 결과/지표/차트 등을 표시
                    </div>
                </div>
                <div className="report-bottom-card">
                    <h4 className="report-bottom-title">결과 B</h4>
                    <div className="report-bottom-body">
                        여기에 B 결과/지표/차트 등을 표시
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ESG_Report_2023;
