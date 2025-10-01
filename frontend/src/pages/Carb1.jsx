// src/pages/Carb1.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { carb1InputQuery, carb1_1InputQuery } from "../api.js";

import "./css/Carb1.css";
import "./css/report.back.css"; // ← 뒤로가기 버튼 스타일 재사용

// 외부 5항목(숫자만 입력)
const EXT_LABELS = [
  "1. 원자재 채취",
  "2. 기자재 제조",
  "3. 원자재 및 기자재 운송 ",
  "4. 선박 폐기 ",
  "5. 재활용 ",
];

// 내부 8단계(숫자만 입력)
const INT_LABELS = [
  "1. 설계",
  "2. 강재적치",
  "3. 강재절단",
  "4. 조립",
  "5. 의장",
  "6. 탑재",
  "7. 안벽작업",
  "8. 시운전",
];

// 숫자만 허용(소수점 1개 허용)으로 정제 - 쉼표 허용
function sanitizeNumeric(input) {
  if (input == null) return "";
  let s = String(input).replace(/,/g, "").replace(/[^0-9.]/g, "");
  const parts = s.split(".");
  if (parts.length > 1) s = parts[0] + "." + parts.slice(1).join("").replace(/\./g, "");
  if (s.startsWith(".")) s = "0" + s;
  return s;
}
function formatNumericWithComma(input) {
  const s = sanitizeNumeric(input);
  if (s === "") return "";
  const [i, d] = s.split(".");
  const iWithComma = i.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return d !== undefined ? `${iWithComma}.${d}` : iWithComma;
}
function validateNumericRaw(raw) {
  if (raw === "") return { formatted: "", error: null };
  const hasBadChar = /[^0-9.,]/.test(raw);
  const rawNoComma = raw.replace(/,/g, "");
  const dotCount = (rawNoComma.match(/\./g) || []).length;
  const startsWithDot = rawNoComma.startsWith(".");
  let error = null;
  if (hasBadChar) error = "숫자, 쉼표(,) 그리고 소수점만 입력 가능해요.";
  else if (dotCount > 1) error = "소수점은 1개만 사용할 수 있어요.";
  else if (startsWithDot) error = "소수점 앞에 숫자를 넣어주세요 (예: 0.5).";
  const formatted = formatNumericWithComma(raw);
  return { formatted, error };
}
const toNum = (v) => Number(String(v ?? "").replace(/,/g, "") || 0);

const LS_KEY = "carb1_form_v1";
const ERROR_FADE_MS = 300;
const ERROR_AUTO_HIDE_MS = 3000;

export default function Carb1() {
  const navigate = useNavigate();
  const BACK_PATH = "/carbon"; // ← 무조건 이동할 대상 경로

  // ===== 외부 =====
  const [ext, setExt] = useState({
    shipKey: "",
    startDate: "",
    endDate: "",
    items: ["", "", "", "", ""],
    userId: "",
  });
  const [extLoading, setExtLoading] = useState(false);
  const [extErrs, setExtErrs] = useState(["", "", "", "", ""]);
  const [extErrLeaving, setExtErrLeaving] = useState([false, false, false, false, false]);
  const extErrTimers = useRef({});

  // ===== 내부 =====
  const [inn, setInn] = useState({
    shipKey: "",
    startDate: "",
    endDate: "",
    steps: ["", "", "", "", "", "", "", ""],
    userId: "",
  });
  const [inLoading, setInLoading] = useState(false);
  const [innErrs, setInnErrs] = useState(["", "", "", "", "", "", "", ""]);
  const [innErrLeaving, setInnErrLeaving] = useState([false, false, false, false, false, false, false, false]);
  const innErrTimers = useRef({});

  // ===== 표에 보여줄 "마지막 저장본" =====
  const [lastSavedExt, setLastSavedExt] = useState(null);
  const [lastSavedInn, setLastSavedInn] = useState(null);

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userKey");
    if (storedUserId) {
      setExt((prev) => ({ ...prev, userId: storedUserId }));
      setInn((prev) => ({ ...prev, userId: storedUserId }));
    }
  }, []);

  // 핸들러(외부)
  const onChangeExt = (e) => {
    const { name, value } = e.target;
    setExt((f) => ({ ...f, [name]: value }));
  };
  const onChangeExtItem = (idx, raw) => {
    const { formatted, error } = validateNumericRaw(raw);
    setExt((f) => {
      const next = f.items.slice();
      next[idx] = formatted;
      return { ...f, items: next };
    });

    setExtErrLeaving((prev) => { const n = prev.slice(); n[idx] = false; return n; });
    setExtErrs((errs) => { const n = errs.slice(); n[idx] = error || ""; return n; });

    if (error) {
      const hideId = setTimeout(() => {
        setExtErrLeaving((prev) => { const n = prev.slice(); n[idx] = true; return n; });
        const clearId = setTimeout(() => {
          setExtErrs((errs) => { const n = errs.slice(); n[idx] = ""; return n; });
          setExtErrLeaving((prev) => { const n = prev.slice(); n[idx] = false; return n; });
          resetErrTimers(extErrTimers, idx);
        }, ERROR_FADE_MS);
        extErrTimers.current[idx].clearId = clearId;
      }, ERROR_AUTO_HIDE_MS);
      extErrTimers.current[idx] = { hideId, clearId: null };
    }
  };

  // 핸들러(내부)
  const onChangeInn = (e) => {
    const { name, value } = e.target;
    setInn((f) => ({ ...f, [name]: value }));
  };
  const onChangeInnStep = (idx, raw) => {
    const { formatted, error } = validateNumericRaw(raw);
    setInn((f) => {
      const next = f.steps.slice();
      next[idx] = formatted;
      return { ...f, steps: next };
    });
    setInnErrLeaving((prev) => { const n = prev.slice(); n[idx] = false; return n; });
    setInnErrs((errs) => { const n = errs.slice(); n[idx] = error || ""; return n; });

    if (error) {
      const hideId = setTimeout(() => {
        setInnErrLeaving((prev) => { const n = prev.slice(); n[idx] = true; return n; });
        const clearId = setTimeout(() => {
          setInnErrs((errs) => { const n = errs.slice(); n[idx] = ""; return n; });
          setInnErrLeaving((prev) => { const n = prev.slice(); n[idx] = false; return n; });
          resetErrTimers(innErrTimers, idx);
        }, ERROR_FADE_MS);
        innErrTimers.current[idx].clearId = clearId;
      }, ERROR_AUTO_HIDE_MS);
      innErrTimers.current[idx] = { hideId, clearId: null };
    }
  };

  // 버튼 활성화 조건
  const isExtReady =
    ext.shipKey.trim() && ext.startDate && ext.endDate && extErrs.every((m) => !m);

  const isInnReady =
    inn.shipKey.trim() &&
    inn.startDate &&
    inn.endDate &&
    inn.steps.every((v) => v.trim()) &&
    innErrs.every((m) => !m);

  // 외부 저장(표에 즉시 반영)
  const submitExternal = async (e) => {
    e.preventDefault();
    if (ext.endDate < ext.startDate) return alert("외부: 종료일이 시작일보다 빠릅니다.");
    const cleanItems = ext.items.map((v) => (v ? v.replace(/,/g, "") : ""));

    setLastSavedExt({
      shipKey: ext.shipKey.trim(),
      startDate: ext.startDate,
      endDate: ext.endDate,
      items: cleanItems.slice(),
    });
    const payload = { ...ext, items: cleanItems };

    const res = await carb1InputQuery(payload);
    if (res?.success) {
      window.dispatchEvent(new CustomEvent("openGlobalModal", { detail: { message: "추가 성공" } }));
      setExt((prev) => ({
        shipKey: "",
        startDate: "",
        endDate: "",
        items: ["", "", "", "", ""],
        userId: prev.userId,
      }));
      setExtErrs(["", "", "", "", ""]);
      setExtErrLeaving([false, false, false, false, false]);
    } else {
      window.dispatchEvent(new CustomEvent("openGlobalModal", { detail: { message: "저장 실패" } }));
    }
  };

  // 내부 저장(표에 즉시 반영)
  const submitInternal = async (e) => {
    e.preventDefault();
    if (inn.endDate < inn.startDate) return alert("내부: 종료일이 시작일보다 빠릅니다.");

    const cleanItems = inn.steps.map((v) => (v ? v.replace(/,/g, "") : ""));
    setLastSavedInn({
      shipKey: inn.shipKey.trim(),
      startDate: inn.startDate,
      endDate: inn.endDate,
      steps: cleanItems.slice(),
    });
    const payload = { ...inn, items: cleanItems };

    const res = await carb1_1InputQuery(payload);
    if (res.success) {
      window.dispatchEvent(new CustomEvent("openGlobalModal", { detail: { message: "추가 성공" } }));
      setInn((prev) => ({
        shipKey: "",
        startDate: "",
        endDate: "",
        steps: ["", "", "", "", "", "", "", ""],
        userId: prev.userId,
      }));
      setExtErrs(["", "", "", "", "", "", "", ""]);
      setExtErrLeaving([false, false, false, false, false, false, false, false]);
    } else {
      window.dispatchEvent(new CustomEvent("openGlobalModal", { detail: { message: "저장 실패" } }));
    }
  };

  // ============================
  // 표에 표시할 데이터 만들기
  // ============================
  const summaryRows = [];
  if (lastSavedExt) {
    EXT_LABELS.forEach((label, i) => {
      const v = lastSavedExt.items?.[i];
      const s = String(v ?? "").trim();
      if (s === "") return;
      const n = toNum(s);
      if (!Number.isFinite(n) || n === 0) return;
      summaryRows.push({
        type: "외부",
        shipKey: lastSavedExt.shipKey || "—",
        start: lastSavedExt.startDate || "—",
        end: lastSavedExt.endDate || "—",
        name: label,
        value: v,
      });
    });
  }
  if (lastSavedInn) {
    INT_LABELS.forEach((label, i) => {
      const v = lastSavedInn.steps?.[i];
      const s = String(v ?? "").trim();
      if (s === "") return;
      summaryRows.push({
        type: "내부",
        shipKey: lastSavedInn.shipKey || "—",
        start: lastSavedInn.startDate || "—",
        end: lastSavedInn.endDate || "—",
        name: label,
        value: v,
      });
    });
  }

  // ============================
  // 플로팅 스크롤 버튼 상태/로직
  // ============================
  const [isBelowHalf, setIsBelowHalf] = useState(false);
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handler = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollTop = window.pageYOffset || doc.scrollTop || 0;
        const max = (doc.scrollHeight - doc.clientHeight) || 0;

        setShowFab(max > 0);

        const ratio = max > 0 ? scrollTop / max : 0;
        setIsBelowHalf(ratio >= 0.5);
        ticking = false;
      });
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  const onFabClick = () => {
    const doc = document.documentElement;
    const targetTop = isBelowHalf ? 0 : doc.scrollHeight;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  return (
    <div className="carb1-container back-root">
      {/* 좌측 상단 뒤로가기 버튼 — 무조건 /esg_back 으로 */}
      <button
        className="back-btn"
        aria-label="뒤로가기"
        onClick={() => navigate(BACK_PATH, { replace: true })}
      >
        {/* 직선형 화살표 아이콘 */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M20 12H8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M12 7L7 12L12 17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* ========== 외부 ========== */}
      <section className="card">
        <h3 className="section-title">① 외부 업체 탄소 배출량 </h3>
        <form onSubmit={submitExternal} style={{ display: "grid", gap: 12 }}>
          <div className="grid-2">
            <div className="field">
              <label className="label">선박 식별자 </label>
              <input
                className="input"
                type="text"
                name="shipKey"
                value={ext.shipKey}
                onChange={onChangeExt}
                placeholder="예: 1, KOR-AB12, ANY-CODE-123"
                required
              />
            </div>
            <div className="field" />
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="label">시작일</label>
              <input
                className="date"
                type="date"
                name="startDate"
                value={ext.startDate}
                onChange={onChangeExt}
                required
              />
            </div>
            <div className="field">
              <label className="label">종료일</label>
              <input
                className="date"
                type="date"
                name="endDate"
                value={ext.endDate}
                onChange={onChangeExt}
                min={ext.startDate || undefined}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            {EXT_LABELS.map((label, i) => (
              <div className="field" key={i}>
                <label className="label">
                  {label} <small>(단위 t)</small>
                </label>
                <input
                  className={`input numeric ${extErrs[i] ? "input-error" : ""}`}
                  type="text"
                  inputMode="decimal"
                  value={ext.items[i]}
                  onChange={(e) => onChangeExtItem(i, e.target.value)}
                  placeholder="예: 1,250.5"
                />
                {extErrs[i] && (
                  <div className={`error-box ${extErrLeaving[i] ? "leaving" : ""}`} role="alert" aria-live="polite">
                    <span className="error-icon" aria-hidden="true">!</span>
                    <span className="error-text">{extErrs[i]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="btn-primary" disabled={extLoading || !isExtReady}>
            {extLoading ? "저장 중..." : "추가"}
          </button>
        </form>
      </section>

      {/* ========== 내부 ========== */}
      <section className="card">
        <h3 className="section-title">② 조선소 내부 탄소 배출량</h3>
        <form onSubmit={submitInternal} style={{ display: "grid", gap: 12 }}>
          <div className="grid-2">
            <div className="field">
              <label className="label">선박 식별자</label>
              <input
                className="input"
                type="text"
                name="shipKey"
                value={inn.shipKey}
                onChange={onChangeInn}
                placeholder="예: 1, KOR-AB12, ANY-CODE-123"
                required
              />
            </div>
            <div className="field" />
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="label">시작일</label>
              <input
                className="date"
                type="date"
                name="startDate"
                value={inn.startDate}
                onChange={onChangeInn}
                required
              />
            </div>
            <div className="field">
              <label className="label">종료일</label>
              <input
                className="date"
                type="date"
                name="endDate"
                value={inn.endDate}
                onChange={onChangeInn}
                min={inn.startDate || undefined}
                required
              />
            </div>
          </div>

          <div className="grid-2">
            {INT_LABELS.map((label, i) => (
              <div className="field" key={i}>
                <label className="label">
                  {label} <small>(단위 t)</small>
                </label>
                <input
                  className={`input numeric ${innErrs[i] ? "input-error" : ""}`}
                  type="text"
                  inputMode="decimal"
                  value={inn.steps[i]}
                  onChange={(e) => onChangeInnStep(i, e.target.value)}
                  placeholder="예: 2,000 또는 2,000.75"
                  required
                />
                {innErrs[i] && (
                  <div className={`error-box ${innErrLeaving[i] ? "leaving" : ""}`} role="alert" aria-live="polite">
                    <span className="error-icon" aria-hidden="true">!</span>
                    <span className="error-text">{innErrs[i]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="btn-primary" disabled={inLoading || !isInnReady}>
            {inLoading ? "저장 중..." : "추가"}
          </button>
        </form>
      </section>

      {/* ⬇️ 플로팅 스크롤 버튼 (윈도우 스크롤 감지) */}
      <button
        type="button"
        className={`scroll-fab ${showFab ? "" : "scroll-fab--hidden"} ${isBelowHalf ? "scroll-fab--up" : "scroll-fab--down"}`}
        onClick={onFabClick}
        aria-label={isBelowHalf ? "맨 위로" : "맨 아래로"}
        title={isBelowHalf ? "맨 위로" : "맨 아래로"}
      >
        {/* 얇은 V 쉐브론 */}
        <svg className="scroll-fab__icon" viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
          <path d="M6.8 9.4 L12 14.1 L17.2 9.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

// 타이머 정리 유틸(원래 있던 것으로 가정)
function resetErrTimers(ref, idx) {
  try {
    const t = ref.current?.[idx];
    if (!t) return;
    if (t.hideId) clearTimeout(t.hideId);
    if (t.clearId) clearTimeout(t.clearId);
    ref.current[idx] = {};
  } catch {}
}
