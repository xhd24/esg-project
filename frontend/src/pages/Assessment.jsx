import React, { useState, useRef, useEffect } from "react";
import questions from "../../../backend/questions"; // 질문 가져오기
import { calculateScore } from "../../../backend/scoreQuestions.js"; // 점수 계산 함수
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
  const toastRef = useRef(null);

  // 모달 상태
  const [modal, setModal] = useState(null);

  const totals = { Environment: 50, Social: 55, Governance: 55 };
  const weights = { Environment: 35, Social: 35, Governance: 30 };

  // 라디오 버튼 응답 저장
  const handleAnswer = (category, qIndex, value) => {
    const updated = { ...answers };
    updated[category][qIndex] = value === "예" ? 1 : 0;
    setAnswers(updated);
    setSaved(false); // 새 답변이 생기면 저장 안내 초기화
  };

  // 제출하기
  const handleSubmit = () => {
    const scores = calculateScore(answers);

    const yesCounts = {};
    const noCounts = {};
    categories.forEach((cat) => {
      const yes = answers[cat].filter((v) => v === 1).length;
      yesCounts[cat] = yes;
      noCounts[cat] = totals[cat] - yes;
    });

    const payload = {
      savedAt: new Date().toISOString(),
      totals,
      weights,
      scores,
      yesCounts,
      noCounts,
      answers,
    };

    localStorage.setItem(REPORT_KEY, JSON.stringify(payload));
    setSaved(true);

    // 저장 완료 모달 표시
    setModal({
      title: "제출 완료",
      message: "수고하셨습니다. 결과가 저장되었습니다.",
      actions: [{ label: "확인", variant: "primary", onClick: () => setModal(null) }],
    });
  };

  // 저장 직후 배지로 스크롤
  useEffect(() => {
    if (saved && toastRef.current) {
      toastRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [saved]);

  return (
    <div className="assessment-container">
      {/* 사이드바 */}
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

      {/* 본문 */}
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
              border: "1px solid #1890ff",
              background: "#e6f7ff",
              borderRadius: 8,
              color: "#0050b3",
              fontWeight: "bold",
            }}
          >
            ℹ️ 결과가 저장되었습니다. 사이드바의 <b>ESG Report</b>에서 확인하세요.
          </div>
        )}

        {questions[selectedCategory].map((q, idx) => {
          const selected = answers[selectedCategory][idx];

          return (
            <div key={q.id} className="question-box">
              <h4 className="question-text">
                {q.id}. {q.text}
              </h4>

              {q.description && (
                <p className="question-description">{q.description}</p>
              )}

              <div className="option-pills" role="radiogroup">
                <input
                  className="pill-input"
                  type="radio"
                  id={`q-${selectedCategory}-${idx}-yes`}
                  name={`q-${selectedCategory}-${idx}`}
                  value="예"
                  checked={selected === 1}
                  onChange={(e) => handleAnswer(selectedCategory, idx, e.target.value)}
                />
                <label
                  className="pill-label"
                  htmlFor={`q-${selectedCategory}-${idx}-yes`}
                >
                  <span className="pill-dot" aria-hidden="true"></span>
                  예
                </label>

                <input
                  className="pill-input"
                  type="radio"
                  id={`q-${selectedCategory}-${idx}-no`}
                  name={`q-${selectedCategory}-${idx}`}
                  value="아니오"
                  checked={selected === 0}
                  onChange={(e) => handleAnswer(selectedCategory, idx, e.target.value)}
                />
                <label
                  className="pill-label"
                  htmlFor={`q-${selectedCategory}-${idx}-no`}
                >
                  <span className="pill-dot" aria-hidden="true"></span>
                  아니오
                </label>
              </div>
            </div>
          );
        })}

        <button className="submit-btn" onClick={handleSubmit}>
          제출하기
        </button>
      </main>

      {/* 모달 */}
      {modal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3 className="modal-title">{modal.title}</h3>
            <p className="modal-message">{modal.message}</p>
            <div className="modal-actions">
              {modal.actions?.map((a, idx) => (
                <button
                  key={idx}
                  className={`alert-btn ${
                    a.variant === "primary" ? "alert-btn--primary" : "alert-btn--ghost"
                  }`}
                  onClick={a.onClick}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assessment;
