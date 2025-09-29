// src/pages/Carb2.jsx
import { useState, useEffect, useRef } from "react";
import { carb2InputQuery } from "../api.js";
import "./css/Carb1.css";

/* ---------- 공통 포맷/검증 ---------- */
function sanitizeNumeric(input) {
  if (input == null) return "";
  // 쉼표 제거 후 숫자/소수점만 남김
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
  // ✅ 정수부만 3자리 콤마
  const iWithComma = i.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return d !== undefined ? `${iWithComma}.${d}` : iWithComma;
}
function formatIntWithComma(input) {
  const s = String(input ?? "").replace(/[^0-9]/g, "");
  if (!s) return "";
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const toNumber = (s) => Number(String(s ?? "").replace(/,/g, "") || 0);

// 소수 허용(최대 1개)의 원본 입력 검증 → 포맷 + 에러 (쉼표 허용)
function validateNumericRaw(raw) {
  if (raw === "") return { formatted: "", error: null };
  const hasBadChar = /[^0-9.,]/.test(raw);
  const rawNoComma = raw.replace(/,/g, "");
  const dotCount = (rawNoComma.match(/\./g) || []).length;
  const startsWithDot = rawNoComma.startsWith(".");
  let error = null;
  if (hasBadChar) error = "숫자, 쉼표(,), 소수점만 입력 가능해요.";
  else if (dotCount > 1) error = "소수점은 1개만 사용할 수 있어요.";
  else if (startsWithDot) error = "소수점 앞에 숫자를 넣어주세요 (예: 0.5).";
  const formatted = formatNumericWithComma(raw);
  return { formatted, error };
}

// 정수 전용의 원본 입력 검증 → 포맷 + 에러 (쉼표 허용)
function validateIntRaw(raw) {
  if (raw === "") return { formatted: "", error: null };
  const hasBadChar = /[^0-9,]/.test(raw);
  let error = null;
  if (hasBadChar) error = "숫자와 쉼표(,)만 입력할 수 있어요.";
  const formatted = formatIntWithComma(raw);
  return { formatted, error };
}

/* ---------- (선택) 과거 저장분을 지우고 시작하고 싶을 때 쓰는 키 ---------- */
const LS_KEY = "carb2_form_v1";

/* ---------- 에러 UI 타이밍 ---------- */
const ERROR_FADE_MS = 300;
const ERROR_AUTO_HIDE_MS = 3000;

function Carb2() {
  const userId = sessionStorage.getItem("userKey") || "";

  // ✅ 처음부터 완전 빈칸으로 시작 (이전 값 자동 복원 없음)
  const [form, setForm] = useState({
    shipKey: "",
    startDate: "",
    endDate: "",
    energyType: "",     // 라디오 전부 해제 (기본값 원하면 "MGO")
    amount: "",
    distanceNm: "",
    capacityTon: "",
    userKey: userId
  });
  const [loading, setLoading] = useState(false);

  // 저장 눌렀을 때 표에 보여줄 스냅샷 (선택적)
  const [lastSaved, setLastSaved] = useState(null);

  // 에러 상태
  const [amountErr, setAmountErr] = useState("");
  const [distanceErr, setDistanceErr] = useState("");
  const [capacityErr, setCapacityErr] = useState("");
  const [amountLeaving, setAmountLeaving] = useState(false);
  const [distanceLeaving, setDistanceLeaving] = useState(false);
  const [capacityLeaving, setCapacityLeaving] = useState(false);

  const amountTimer = useRef({ hideId: null, clearId: null });
  const distanceTimer = useRef({ hideId: null, clearId: null });
  const capacityTimer = useRef({ hideId: null, clearId: null });

  const resetTimer = (ref) => {
    if (ref.current.hideId) clearTimeout(ref.current.hideId);
    if (ref.current.clearId) clearTimeout(ref.current.clearId);
    ref.current.hideId = null;
    ref.current.clearId = null;
  };

  // ✅ 마운트 시 과거 로컬스토리지 청소만 수행(자동 복원/저장 안 함)
  useEffect(() => {
    try { localStorage.removeItem(LS_KEY); } catch {}
    return () => {
      resetTimer(amountTimer);
      resetTimer(distanceTimer);
      resetTimer(capacityTimer);
    };
  }, []);

  // onChange
  const onChangeBasic = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const onChangeAmount = (e) => {
    const { formatted, error } = validateNumericRaw(e.target.value);
    setForm((f) => ({ ...f, amount: formatted }));
    resetTimer(amountTimer);
    setAmountLeaving(false);
    setAmountErr(error || "");
    if (error) {
      amountTimer.current.hideId = setTimeout(() => {
        setAmountLeaving(true);
        amountTimer.current.clearId = setTimeout(() => {
          setAmountErr("");
          setAmountLeaving(false);
          resetTimer(amountTimer);
        }, ERROR_FADE_MS);
      }, ERROR_AUTO_HIDE_MS);
    }
  };
  const onChangeDistance = (e) => {
    const { formatted, error } = validateIntRaw(e.target.value);
    setForm((f) => ({ ...f, distanceNm: formatted }));
    resetTimer(distanceTimer);
    setDistanceLeaving(false);
    setDistanceErr(error || "");
    if (error) {
      distanceTimer.current.hideId = setTimeout(() => {
        setDistanceLeaving(true);
        distanceTimer.current.clearId = setTimeout(() => {
          setDistanceErr("");
          setDistanceLeaving(false);
          resetTimer(distanceTimer);
        }, ERROR_FADE_MS);
      }, ERROR_AUTO_HIDE_MS);
    }
  };
  const onChangeCapacity = (e) => {
    const { formatted, error } = validateIntRaw(e.target.value);
    setForm((f) => ({ ...f, capacityTon: formatted }));
    resetTimer(capacityTimer);
    setCapacityLeaving(false);
    setCapacityErr(error || "");
    if (error) {
      capacityTimer.current.hideId = setTimeout(() => {
        setCapacityLeaving(true);
        capacityTimer.current.clearId = setTimeout(() => {
          setCapacityErr("");
          setCapacityLeaving(false);
          resetTimer(capacityTimer);
        }, ERROR_FADE_MS);
      }, ERROR_AUTO_HIDE_MS);
    }
  };

  // 제출 가능 여부
  const isReady =
    form.shipKey.trim().length > 0 &&
    form.startDate &&
    form.endDate &&
    ["MGO", "HFO", "LNG"].includes(form.energyType) &&
    form.amount.trim().length > 0 &&
    form.distanceNm.trim().length > 0 &&
    form.capacityTon.trim().length > 0 &&
    !amountErr && !distanceErr && !capacityErr;

  // 🔸 에러/타이머 초기화 + 폼 초기화
  const clearAllErrorUI = () => {
    setAmountErr("");
    setDistanceErr("");
    setCapacityErr("");
    setAmountLeaving(false);
    setDistanceLeaving(false);
    setCapacityLeaving(false);
    resetTimer(amountTimer);
    resetTimer(distanceTimer);
    resetTimer(capacityTimer);
  };

  const resetForm = () => {
    setForm((prev) => ({
      shipKey: "",
      startDate: "",     // 오늘 날짜 자동 채움 원하면 여기서 today로 바꾸세요
      endDate: "",
      energyType: "",    // 기본 MGO 원하면 "MGO"
      amount: "",
      distanceNm: "",
      capacityTon: "",
      userKey: prev.userKey // 세션 사용자키 유지
    }));
    try { localStorage.removeItem(LS_KEY); } catch {}
    clearAllErrorUI();
  };

  // 제출
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isReady) return;
    if (form.endDate < form.startDate) return alert("종료일이 시작일보다 빠릅니다.");

    const amount = toNumber(form.amount);
    const distanceNm = toNumber(form.distanceNm);
    const capacityTon = toNumber(form.capacityTon);
    if (!(amount > 0 && distanceNm > 0 && capacityTon > 0)) {
      return alert("모든 수치는 0보다 커야 합니다.");
    }

    // (선택) 표에 즉시 반영될 스냅샷
    setLastSaved({
      shipKey: form.shipKey.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      energyType: form.energyType,
      amount: form.amount,
      distanceNm: form.distanceNm,
      capacityTon: form.capacityTon
    });

    try {
      setLoading(true);
      const res = await carb2InputQuery(form);
      if (res?.success) {
        alert("추가 성공");
        resetForm(); // ✅ 성공 시 모든 필드 비우기
      } else {
        alert("저장 실패");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 표 표시용(마지막 저장본)
  const unit = "ton";

  return (
    <div className="carb1-container">
      <section className="card">
        <h2 className="section-title">운항</h2>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          {/* shipKey */}
          <div className="field">
            <div className="label">선박 식별자 (shipId 또는 코드)</div>
            <input
              className="input"
              name="shipKey"
              value={form.shipKey}
              onChange={onChangeBasic}
              type="text"
              placeholder="예: 1 또는 KOR-AB12"
              autoComplete="off"
              required
            />
          </div>

          {/* date range */}
          <div className="grid-2">
            <div className="field">
              <div className="label">운항 시작일</div>
              <input
                className="date"
                name="startDate"
                value={form.startDate}
                onChange={onChangeBasic}
                type="date"
                required
              />
            </div>
            <div className="field">
              <div className="label">운항 종료일</div>
              <input
                className="date"
                name="endDate"
                value={form.endDate}
                onChange={onChangeBasic}
                type="date"
                min={form.startDate || undefined}
                required
              />
            </div>
          </div>

          {/* energyType */}
          <div className="field">
            <div className="label">연료</div>
            <label style={{ marginRight: 12 }}>
              <input
                type="radio"
                name="energyType"
                value="MGO"
                checked={form.energyType === "MGO"}
                onChange={onChangeBasic}
              />{" "}
              MGO
            </label>{" "}
            <label style={{ marginRight: 12 }}>
              <input
                type="radio"
                name="energyType"
                value="HFO"
                checked={form.energyType === "HFO"}
                onChange={onChangeBasic}
              />{" "}
              HFO
            </label>{" "}
            <label>
              <input
                type="radio"
                name="energyType"
                value="LNG"
                checked={form.energyType === "LNG"}
                onChange={onChangeBasic}
              />{" "}
              LNG
            </label>
          </div>

          {/* amount (소수 허용) */}
          <div className="field">
            <div className="label">
              연료 사용량 <small style={{ color: "#7b8f86" }}>(단위: {unit})</small>
            </div>
            <input
              className={`input numeric ${amountErr ? "input-error" : ""}`}
              name="amount"
              value={form.amount}
              onChange={onChangeAmount}
              type="text"
              inputMode="decimal"
              placeholder="예: 4,500.000"
              required
            />
            {amountErr && (
              <div className={`error-box ${amountLeaving ? "leaving" : ""}`} role="alert" aria-live="polite">
                <span className="error-icon" aria-hidden="true">!</span>
                <span className="error-text">{amountErr}</span>
              </div>
            )}
          </div>

          {/* distance & capacity (정수) */}
          <div className="grid-2">
            <div className="field">
              <div className="label">운항거리 (nm)</div>
              <input
                className={`input numeric ${distanceErr ? "input-error" : ""}`}
                name="distanceNm"
                value={form.distanceNm}
                onChange={onChangeDistance}
                type="text"
                inputMode="numeric"
                placeholder="예: 1,250"
                required
              />
              {distanceErr && (
                <div className={`error-box ${distanceLeaving ? "leaving" : ""}`} role="alert" aria-live="polite">
                  <span className="error-icon" aria-hidden="true">!</span>
                  <span className="error-text">{distanceErr}</span>
                </div>
              )}
            </div>
            <div className="field">
              <div className="label">적재능력 (ton DWT)</div>
              <input
                className={`input numeric ${capacityErr ? "input-error" : ""}`}
                name="capacityTon"
                value={form.capacityTon}
                onChange={onChangeCapacity}
                type="text"
                inputMode="numeric"
                placeholder="예: 52,000"
                required
              />
              {capacityErr && (
                <div className={`error-box ${capacityLeaving ? "leaving" : ""}`} role="alert" aria-live="polite">
                  <span className="error-icon" aria-hidden="true">!</span>
                  <span className="error-text">{capacityErr}</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !isReady}
            title={!isReady ? "모든 값을 올바르게 입력해야 저장할 수 있어요." : undefined}
          >
            {loading ? "저장 중..." : "추가"}
          </button>
        </form>
      </section>
    </div>
  );
}

export default Carb2;
