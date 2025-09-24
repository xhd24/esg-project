import React, { useState, useRef, useEffect } from "react";
import questions from "../../../backend/questions"; // 질문 가져오기
import { calculateScore } from "../../../backend/scoreQuestions.js"; // 계산 함수 import
import "./css/questions.css";

const REPORT_KEY = "ESG_REPORT_V1";

function Assessment() {
  const categories = ["Environment", "Social", "Governance"];
  const [selectedCategory, setSelectedCategory] = useState("Environment");
  const [answers, setAnswers] = useState({
    Environment: Array(50).fill(null),
    Social: Array(55).fill(null),
    Governance: Array(55).fill(null),
  });

  const [saved, setSaved] = useState(false);
  const toastRef = useRef(null); // ✅ 저장 배지 ref 추가

  const totals = { Environment: 50, Social: 55, Governance: 55 };
  const weights = { Environment: 35, Social: 35, Governance: 30 };

  // 라디오 버튼 선택 시 값 저장
  const handleAnswer = (category, qIndex, value) => {
    const updated = { ...answers };
    updated[category][qIndex] = value === "예" ? 1 : 0;
    setAnswers(updated);
    setSaved(false); // 응답 변경 시 저장 알림 초기화
  };

  const handleSubmit = () => {
    // 1) 점수 계산
    const scores = calculateScore(answers); // {Environment, Social, Governance, total}

    // 2) 예/아니오 개수 집계(미응답은 0으로 간주)
    const yesCounts = {};
    const noCounts = {};
    categories.forEach((cat) => {
      const yes = answers[cat].filter((v) => v === 1).length;
      yesCounts[cat] = yes;
      noCounts[cat] = totals[cat] - yes;
    });

    // 3) 저장 payload 구성
    const payload = {
      savedAt: new Date().toISOString(),
      totals,
      weights,
      scores,       // 소수점은 ESG_Report에서 포맷팅
      yesCounts,
      noCounts,
      answers,      // 상세 보기용(원하면 리포트에서 활용)
    };

    // 4) localStorage 저장
    localStorage.setItem(REPORT_KEY, JSON.stringify(payload));
    setSaved(true);
  };

  // ✅ 저장 직후 배지 위치로 스크롤 이동
  useEffect(() => {
    if (saved && toastRef.current) {
      toastRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [saved]);

  return (
    <div className="assessment-container">
      {/* 왼쪽 사이드바 */}
      <aside className="assessment-sidebar">
        <h3>카테고리</h3>
        <ul>
          {categories.map((cat) => (
            <li
              key={cat}
              className={selectedCategory === cat ? "active" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      {/* 오른쪽 설문 영역 */}
      <main className="assessment-content">
        <h2>{selectedCategory} 설문조사</h2>

        {/* 저장 안내 배지 */}
        {saved && (
          <div
            ref={toastRef}
            className="save-toast"
            style={{
              marginBottom: 12,
              padding: 10,
              border: "1px solid #1890ff", // 파랑 테두리
              background: "#e6f7ff", // 연한 파랑 배경
              borderRadius: 8,
              color: "#0050b3", // 글자 진한 파랑
              fontWeight: "bold"
            }}
          >
            ℹ️ 결과가 저장되었습니다. 사이드바의 <b>ESG Report</b>에서 확인하세요.
          </div>
        )}

        {questions[selectedCategory].map((q, idx) => (
          <div key={q.id} className="question-box">
            <h4 className="question-text">
              {q.id}. {q.text}
            </h4>

            {q.description && (
              <p className="question-description">{q.description}</p>
            )}

            {q.options.map((opt, oIdx) => (
              <label key={oIdx} style={{ display: "block", cursor: "pointer" }}>
                <input
                  type="radio"
                  name={`${selectedCategory}-${idx}`}
                  value={opt}
                  checked={answers[selectedCategory][idx] === (opt === "예" ? 1 : 0)}
                  onChange={(e) => handleAnswer(selectedCategory, idx, e.target.value)}
                  style={{ marginRight: 6 }}
                />
                {opt}
              </label>
            ))}
          </div>
        ))}

        <button className="submit-btn" onClick={handleSubmit}>
          제출하기
        </button>
      </main>
    </div>
  );
}

export default Assessment;
