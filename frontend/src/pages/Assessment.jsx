import React, { useState, useRef, useEffect } from "react";
import questions from "../../../backend/questions"; // 질문 가져오기
import { calculateScore } from "../../../backend/scoreQuestions.js"; // 점수 계산 함수
import "./css/questions.css";

const REPORT_KEY = "ESG_REPORT_V1";

function Assessment() {
  const categories = ["Environment", "Social", "Governance"];
  const [selectedCategory, setSelectedCategory] = useState("Environment");

  // 각 카테고리 응답
  const [answers, setAnswers] = useState({
    Environment: Array(50).fill(null),
    Social: Array(55).fill(null),
    Governance: Array(55).fill(null),
  });

  const [saved, setSaved] = useState(false);
  const toastRef = useRef(null);

  // 모달
  const [modal, setModal] = useState(null);

  // 질문 DOM 참조 & 하이라이트(빨간 테두리)
  const questionRefs = useRef({});
  const [highlightKey, setHighlightKey] = useState(null);

  const totals = {
    Environment: questions.Environment.length,
    Social: questions.Social.length,
    Governance: questions.Governance.length,
  };
  const weights = { Environment: 35, Social: 35, Governance: 30 };

  // 라디오 응답 저장
  const handleAnswer = (category, qIndex, value) => {
    setAnswers((prev) => {
      const updated = { ...prev };
      const next = [...(updated[category] || [])];
      next[qIndex] = value === "예" ? 1 : 0;
      updated[category] = next;
      return updated;
    });
    setSaved(false);
  };

  // ---- 스크롤 유틸 ----
  const SCROLLER_SELECTOR = ".assessment-content";
  const scrollToTopBoth = (behavior = "auto") => {
    const scroller = document.querySelector(SCROLLER_SELECTOR);
    if (scroller) scroller.scrollTo({ top: 0, left: 0, behavior });
    window.scrollTo({ top: 0, left: 0, behavior });
  };
  const scrollToQuestion = (cat, idx, behavior = "smooth") => {
    const key = `${cat}-${idx}`;
    const el = questionRefs.current[key];
    if (el?.scrollIntoView) el.scrollIntoView({ behavior, block: "start" });
    // 빨간 테두리 하이라이트 부여 후 부드럽게 해제
    setHighlightKey(key);
    setTimeout(() => setHighlightKey(null), 1400);
  };

  // 카테고리 바뀌면 맨 위로
  useEffect(() => {
    requestAnimationFrame(() => scrollToTopBoth("auto"));
  }, [selectedCategory]);

  // 저장 후 토스트로 스크롤
  useEffect(() => {
    if (saved && toastRef.current) {
      toastRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [saved]);

  // ---- 미응답 찾기 ----
  const findUnansweredIndices = (cat) => {
    const count = totals[cat];
    const arr = answers[cat] || [];
    const missing = [];
    for (let i = 0; i < count; i++) {
      if (arr[i] !== 1 && arr[i] !== 0) missing.push(i);
    }
    return missing;
  };

  // ---- 네비게이션 ----
  const goPrev = () => {
    const idx = categories.indexOf(selectedCategory);
    if (idx > 0) setSelectedCategory(categories[idx - 1]);
  };

  const goNext = () => {
    const current = selectedCategory;
    const idx = categories.indexOf(current);
    if (idx === categories.length - 1) return;

    const nextCat = categories[idx + 1];
    const missing = findUnansweredIndices(current);

    if (missing.length > 0) {
      const firstIdx = missing[0];
      setModal({
        title: "미응답 문항 안내",
        message: `${current} 카테고리에 미응답 문항이 ${missing.length}개 있어요.\n첫 미응답 문항(#${firstIdx + 1}) 위치로 이동합니다.`,
        actions: [
          { label: "취소", variant: "ghost", onClick: () => setModal(null) },
          {
            label: "이동",
            variant: "primary",
            onClick: () => {
              setModal(null);
              scrollToQuestion(current, firstIdx, "smooth");
            },
          },
        ],
      });
      return;
    }

    setModal({
      title: "이동 안내",
      message: `${nextCat}로 넘어갑니다.`,
      actions: [
        { label: "취소", variant: "ghost", onClick: () => setModal(null) },
        {
          label: "이동",
          variant: "primary",
          onClick: () => {
            setModal(null);
            setSelectedCategory(nextCat);
          },
        },
      ],
    });
  };

  // ---- 최종 제출 ----
  const submitAll = () => {
    for (const cat of categories) {
      const missing = findUnansweredIndices(cat);
      if (missing.length > 0) {
        const firstIdx = missing[0];
        setSelectedCategory(cat);
        setTimeout(() => {
          setModal({
            title: "미응답 문항 안내",
            message: `${cat} 카테고리에 미응답 문항이 ${missing.length}개 있어요.\n첫 미응답 문항(#${firstIdx + 1}) 위치로 이동합니다.`,
            actions: [
              { label: "취소", variant: "ghost", onClick: () => setModal(null) },
              {
                label: "이동",
                variant: "primary",
                onClick: () => {
                  setModal(null);
                  scrollToQuestion(cat, firstIdx, "smooth");
                },
              },
            ],
          });
        }, 0);
        return;
      }
    }

    const scores = calculateScore(answers);

    const yesCounts = {};
    const noCounts = {};
    categories.forEach((cat) => {
      const count = totals[cat];
      const yes = (answers[cat] || []).slice(0, count).filter((v) => v === 1).length;
      yesCounts[cat] = yes;
      noCounts[cat] = count - yes;
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

    setModal({
      title: "제출 완료",
      message: "수고하셨습니다. 결과가 저장되었습니다.",
      actions: [{ label: "확인", variant: "primary", onClick: () => setModal(null) }],
    });
  };

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

        {(questions[selectedCategory] || []).map((q, idx) => {
          const selected = answers[selectedCategory][idx];
          const key = `${selectedCategory}-${idx}`;
          const isMissing = highlightKey === key;

          return (
            <div
              key={q.id}
              className={`question-box ${isMissing ? "missing" : ""}`}
              ref={(el) => (questionRefs.current[key] = el)}
            >
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
                <label className="pill-label" htmlFor={`q-${selectedCategory}-${idx}-yes`}>
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
                <label className="pill-label" htmlFor={`q-${selectedCategory}-${idx}-no`}>
                  <span className="pill-dot" aria-hidden="true"></span>
                  아니오
                </label>
              </div>
            </div>
          );
        })}

        {/* 하단 버튼 */}
        <div className="btn-row" style={{ marginTop: 16 }}>
          {selectedCategory === "Environment" && (
            <button className="btn btn--primary" onClick={goNext}>
              다음
            </button>
          )}

          {selectedCategory === "Social" && (
            <>
              <button className="btn btn--ghost" onClick={goPrev}>
                뒤로가기
              </button>
              <button className="btn btn--primary" onClick={goNext}>
                다음
              </button>
            </>
          )}

          {selectedCategory === "Governance" && (
            <>
              <button className="btn btn--ghost" onClick={goPrev}>
                뒤로가기
              </button>
              <button className="btn btn--primary" onClick={submitAll}>
                최종제출
              </button>
            </>
          )}
        </div>
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
