// frontend/src/pages/Assessment.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/questions.css";
import { getEsgQuestions, getMyEsgAnswers, saveEsgAnswersBulk } from "../api";

const REPORT_KEY = "ESG_REPORT_V1";

function Assessment() {
  const navigate = useNavigate();
  const categories = ["Environment", "Social", "Governance"];

  const userKey =
    sessionStorage.getItem("userKey") || localStorage.getItem("userKey");

  const [selectedCategory, setSelectedCategory] = useState("Environment");

  const [questions, setQuestions] = useState({
    Environment: [],
    Social: [],
    Governance: [],
  });

  // { [cat]: { [question_id]: '예'|'아니오' } }
  const [answers, setAnswers] = useState({
    Environment: {},
    Social: {},
    Governance: {},
  });

  const [saved, setSaved] = useState(false);
  const toastRef = useRef(null);
  const [modal, setModal] = useState(null);
  const questionRefs = useRef({});
  const [highlightKey, setHighlightKey] = useState(null);

  const [loading, setLoading] = useState(!!userKey);
  const [error, setError] = useState("");

  // 초기 로드
  useEffect(() => {
    if (!userKey) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const qObj = {};
        const aObj = {};
        for (const cat of categories) {
          qObj[cat] = await getEsgQuestions(cat);
          aObj[cat] = await getMyEsgAnswers(cat);
        }
        setQuestions(qObj);
        setAnswers(aObj);
        setError("");
      } catch (e) {
        if (e?.message === "UNAUTHORIZED") {
          setError("세션이 만료되었거나 권한이 없습니다. 다시 로그인해 주세요.");
        } else {
          setError("데이터를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
        }
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userKey]);

  // 스크롤/하이라이트
  const SCROLLER_SELECTOR = ".assessment-content";
  const scrollToTopBoth = (behavior = "auto") => {
    const scroller = document.querySelector(SCROLLER_SELECTOR);
    if (scroller) scroller.scrollTo({ top: 0, left: 0, behavior });
    window.scrollTo({ top: 0, left: 0, behavior });
  };
  useEffect(() => {
    requestAnimationFrame(() => scrollToTopBoth("auto"));
  }, [selectedCategory]);

  useEffect(() => {
    if (saved && toastRef.current) {
      toastRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [saved]);

  const scrollToQuestion = (cat, qid, behavior = "smooth") => {
    const key = `${cat}-${qid}`;
    const el = questionRefs.current[key];
    if (el?.scrollIntoView) el.scrollIntoView({ behavior, block: "start" });
    setHighlightKey(key);
    setTimeout(() => setHighlightKey(null), 1400);
  };

  // 라디오 응답
  const handleAnswer = (category, questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [category]: { ...(prev[category] || {}), [questionId]: option },
    }));
    setSaved(false);
  };

  // ✅ 전체 예/전체 아니오 헬퍼
  const pickOption = (q, target /* '예' | '아니오' */) => {
    const opts = q.options || ["예", "아니오"];
    // 옵션에 정확히 '예'/'아니오'가 있으면 그대로, 없으면 가장 첫 옵션으로 폴백
    if (opts.includes(target)) return target;
    return opts[0];
  };

  const setAllForCategory = (cat, target /* '예' | '아니오' */) => {
    const qs = questions[cat] || [];
    const nextMap = {};
    for (const q of qs) {
      nextMap[q.id] = pickOption(q, target);
    }
    setAnswers((prev) => ({ ...prev, [cat]: nextMap }));
    setSaved(false);
  };

  // 미응답 찾기
  const findUnansweredIds = (cat) => {
    const qs = questions[cat] || [];
    const map = answers[cat] || {};
    return qs.filter((q) => !map[q.id]).map((q) => q.id);
  };

  // 네비게이션
  const goPrev = () => {
    const idx = categories.indexOf(selectedCategory);
    if (idx > 0) setSelectedCategory(categories[idx - 1]);
  };
  const goNext = () => {
    const current = selectedCategory;
    const idx = categories.indexOf(current);
    if (idx === categories.length - 1) return;

    const nextCat = categories[idx + 1];
    const missingIds = findUnansweredIds(current);

    if (missingIds.length > 0) {
      const firstId = missingIds[0];
      setModal({
        title: "미응답 문항 안내",
        message: `${current} 카테고리에 미응답 문항이 ${missingIds.length}개 있어요.\n첫 미응답 문항(#${firstId}) 위치로 이동합니다.`,
        actions: [
          { label: "취소", variant: "ghost", onClick: () => setModal(null) },
          {
            label: "이동",
            variant: "primary",
            onClick: () => {
              setModal(null);
              scrollToQuestion(current, firstId, "smooth");
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

  // 최종 제출 (JSON 저장 규격으로 구성)
  const submitAll = async () => {
    for (const cat of categories) {
      const missing = findUnansweredIds(cat);
      if (missing.length > 0) {
        const firstId = missing[0];
        setSelectedCategory(cat);
        setTimeout(() => {
          setModal({
            title: "미응답 문항 안내",
            message: `${cat} 카테고리에 미응답 문항이 ${missing.length}개 있어요.\n첫 미응답 문항(#${firstId}) 위치로 이동합니다.`,
            actions: [
              { label: "취소", variant: "ghost", onClick: () => setModal(null) },
              {
                label: "이동",
                variant: "primary",
                onClick: () => {
                  setModal(null);
                  scrollToQuestion(cat, firstId, "smooth");
                },
              },
            ],
          });
        }, 0);
        return;
      }
    }

    // 서버 저장 페이로드: [{category, questionid, question, answer}]
    const toSave = [];
    categories.forEach((cat) => {
      const map = answers[cat] || {};
      const qs = questions[cat] || [];
      for (const q of qs) {
        const opt = map[q.id];
        if (!opt) continue;
        toSave.push({
          category: q.category,
          questionid: Number(q.id),
          question: q.text,
          answer: opt,
        });
      }
    });

    try {
      const resp = await saveEsgAnswersBulk(toSave);
      if (resp?.success) {
        setSaved(true);
        localStorage.setItem(
          REPORT_KEY,
          JSON.stringify({
            savedAt: new Date().toISOString(),
            answers,
          })
        );
        setModal({
          title: "제출 완료",
          message: "수고하셨습니다. 결과가 저장되었습니다.",
          actions: [{ label: "확인", variant: "primary", onClick: () => setModal(null) }],
        });
      } else {
        throw new Error("SAVE_FAILED");
      }
    } catch (e) {
      if (e?.message === "UNAUTHORIZED") {
        setModal({
          title: "로그인이 필요합니다",
          message: "세션이 만료되었어요. 다시 로그인해 주세요.",
          actions: [{ label: "로그인", variant: "primary", onClick: () => navigate("/login") }],
        });
      } else {
        setModal({
          title: "오류",
          message: "저장 중 오류가 발생했습니다.",
          actions: [{ label: "확인", variant: "primary", onClick: () => setModal(null) }],
        });
      }
    }
  };

  // 렌더 가드
  if (!userKey) {
    return (
      <div style={{ padding: 24 }}>
        로그인이 필요합니다{" "}
        <button className="btn btn--primary" onClick={() => navigate("/login")}>
          로그인 하러가기
        </button>
      </div>
    );
  }

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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h2 style={{ marginRight: "auto" }}>{selectedCategory} 설문조사</h2>

          {/* ✅ 전체 선택 버튼 */}
          <button
            className="btn btn--ghost"
            onClick={() => setAllForCategory(selectedCategory, "예")}
            disabled={loading || (questions[selectedCategory] || []).length === 0}
            title="현재 카테고리의 모든 문항을 '예'로 선택"
          >
            전체 예
          </button>
          <button
            className="btn btn--ghost"
            onClick={() => setAllForCategory(selectedCategory, "아니오")}
            disabled={loading || (questions[selectedCategory] || []).length === 0}
            title="현재 카테고리의 모든 문항을 '아니오'로 선택"
          >
            전체 아니오
          </button>
        </div>

        {loading && <div style={{ marginBottom: 12 }}>불러오는 중…</div>}
        {error && (
          <div style={{ marginBottom: 12, color: "crimson" }}>
            {error}{" "}
            <button className="btn btn--ghost" onClick={() => navigate("/login")}>
              로그인
            </button>
          </div>
        )}

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
            ℹ️ 서버에 저장되었습니다. 사이드바의 <b>ESG Report</b>에서 확인하세요.
          </div>
        )}

        {(questions[selectedCategory] || []).map((q) => {
          const selected = (answers[selectedCategory] || {})[q.id] || null;
          const key = `${selectedCategory}-${q.id}`;
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

              <div className="option-pills" role="radiogroup" aria-label={`q-${q.id}`}>
                {(q.options || ["예", "아니오"]).map((opt, i) => (
                  <React.Fragment key={i}>
                    <input
                      className="pill-input"
                      type="radio"
                      id={`q-${key}-${i}`}
                      name={`q-${key}`}
                      value={opt}
                      checked={selected === opt}
                      onChange={(e) =>
                        handleAnswer(selectedCategory, q.id, e.target.value)
                      }
                    />
                    <label className="pill-label" htmlFor={`q-${key}-${i}`}>
                      <span className="pill-dot" aria-hidden="true"></span>
                      {opt}
                    </label>
                  </React.Fragment>
                ))}
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
