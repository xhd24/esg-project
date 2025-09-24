// src/pages/Carb1.jsx
import { useState, useEffect, useRef } from "react";
import "./css/Carb1.css";

// 외부 5항목(숫자만 입력)
const EXT_LABELS = [
  "1. 원자재 채취",
  "2. 기자재 제조",
  "3. 원자재 및 기자재 운송 ",
  "4. 선박 폐기 ",
  "5. 재활용 "
];

// 내부 8단계(숫자만 입력)
const INT_LABELS = [
  "1. 설계","2. 강재적치","3. 강재절단","4. 조립",
  "5. 의장","6. 탑재","7. 안변작업","8. 시운전"
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
// 천 단위 콤마 포맷(소수점 유지)
function formatNumericWithComma(input) {
  const s = sanitizeNumeric(input);
  if (s === "") return "";
  const [i, d] = s.split(".");
  const iWithComma = i.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return d !== undefined ? `${iWithComma}.${d}` : iWithComma;
}

// 원본(raw) 검사 → 포맷 + 에러
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

// 유틸
const toNum = (v) => Number(String(v ?? "").replace(/,/g, "") || 0);

// ----- 로컬스토리지 키 & 에러 애니메이션 -----
const LS_KEY = "carb1_form_v1";
const ERROR_FADE_MS = 300;
const ERROR_AUTO_HIDE_MS = 3000;

export default function Carb1() {
  // ===== 외부 =====
  const [ext, setExt] = useState({
    shipKey: "", startDate: "", endDate: "", items: ["", "", "", "", ""]
  });
  const [extLoading, setExtLoading] = useState(false);
  const [extErrs, setExtErrs] = useState(["", "", "", "", ""]);
  const [extErrLeaving, setExtErrLeaving] = useState([false, false, false, false, false]);
  const extErrTimers = useRef({});

  // ===== 내부 =====
  const [inn, setInn] = useState({
    shipKey: "", startDate: "", endDate: "", steps: ["", "", "", "", "", "", "", ""]
  });
  const [inLoading, setInLoading] = useState(false);
  const [innErrs, setInnErrs] = useState(["", "", "", "", "", "", "", ""]);
  const [innErrLeaving, setInnErrLeaving] = useState([false, false, false, false, false, false, false, false]);
  const innErrTimers = useRef({});

  // ===== 표에 보여줄 "마지막 저장본" =====
  const [lastSavedExt, setLastSavedExt] = useState(null);
  const [lastSavedInn, setLastSavedInn] = useState(null);

  // ===== 마운트 시 복원 =====
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.ext) setExt((p) => ({ ...p, ...parsed.ext }));
        if (parsed.inn) setInn((p) => ({ ...p, ...parsed.inn }));
        return;
      }
    } catch {}
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const today = `${yyyy}-${mm}-${dd}`;
    setExt((f) => ({ ...f, startDate: today, endDate: today }));
    setInn((f) => ({ ...f, startDate: today, endDate: today }));
  }, []);

  // ===== 변경 시 자동 저장(디바운스) =====
  const saveTimer = useRef(null);
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try { localStorage.setItem(LS_KEY, JSON.stringify({ ext, inn })); } catch {}
    }, 300);
    return () => clearTimeout(saveTimer.current);
  }, [ext, inn]);

  // 언마운트 시 남은 에러 타이머 정리
  useEffect(() => {
    return () => {
      Object.values(extErrTimers.current).forEach(({ hideId, clearId }) => {
        if (hideId) clearTimeout(hideId);
        if (clearId) clearTimeout(clearId);
      });
      Object.values(innErrTimers.current).forEach(({ hideId, clearId }) => {
        if (hideId) clearTimeout(hideId);
        if (clearId) clearTimeout(clearId);
      });
    };
  }, []);

  // 공통 타이머 초기화
  const resetErrTimers = (store, idx) => {
    const t = store.current[idx];
    if (t) {
      if (t.hideId) clearTimeout(t.hideId);
      if (t.clearId) clearTimeout(t.clearId);
      delete store.current[idx];
    }
  };

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
    resetErrTimers(extErrTimers, idx);
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
    resetErrTimers(innErrTimers, idx);
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
    ext.shipKey.trim() &&
    ext.startDate && ext.endDate &&
    extErrs.every((m) => !m); // 외부 숫자칸은 일부 비워도 OK

  const isInnReady =
    inn.shipKey.trim() &&
    inn.startDate && inn.endDate &&
    inn.steps.every((v) => v.trim()) &&
    innErrs.every((m) => !m);

  // 날짜 배열
  const days = (a, b) => {
    const out = [];
    const A = new Date(a + "T00:00:00"), B = new Date(b + "T00:00:00");
    for (let d = A; d <= B; d.setDate(d.getDate() + 1)) {
      const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
      out.push(`${y}-${m}-${day}`);
    }
    return out;
  };

  // 외부 저장(표에 즉시 반영)
  const submitExternal = async (e) => {
    e.preventDefault();
    if (ext.endDate < ext.startDate) return alert("외부: 종료일이 시작일보다 빠릅니다.");
    setLastSavedExt({
      shipKey: ext.shipKey.trim(),
      startDate: ext.startDate,
      endDate: ext.endDate,
      items: ext.items.slice()
    });
    try {
      setExtLoading(true);
      const shipPayload = /^\d+$/.test(ext.shipKey.trim())
        ? { shipId: Number(ext.shipKey.trim()) }
        : { shipCode: ext.shipKey.trim() };
      for (const date of days(ext.startDate, ext.endDate)) {
        const payload = {
          ...shipPayload,
          date,
          category: "외부업체",
          stage: "선박건조공정",
          lifecycle: { items: { 1: ext.items[0], 2: ext.items[1], 3: ext.items[2], 4: ext.items[3], 5: ext.items[4] } }
        };
        await fetch("/api/stage-activities", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        }).catch(() => {});
      }
      alert("외부: 저장 완료(미리보기 반영).");
      localStorage.setItem(LS_KEY, JSON.stringify({ ext, inn }));
    } catch {
      alert("외부 저장 요청 실패(서버 미응답). 미리보기만 반영되었습니다.");
    } finally {
      setExtLoading(false);
    }
  };

  // 내부 저장(표에 즉시 반영)
  const submitInternal = async (e) => {
    e.preventDefault();
    if (inn.endDate < inn.startDate) return alert("내부: 종료일이 시작일보다 빠릅니다.");
    setLastSavedInn({
      shipKey: inn.shipKey.trim(),
      startDate: inn.startDate,
      endDate: inn.endDate,
      steps: inn.steps.slice()
    });
    try {
      setInLoading(true);
      const shipPayload = /^\d+$/.test(inn.shipKey.trim())
        ? { shipId: Number(inn.shipKey.trim()) }
        : { shipCode: inn.shipKey.trim() };
      for (const date of days(inn.startDate, inn.endDate)) {
        const payload = {
          ...shipPayload,
          date,
          category: "조선소 내부",
          stage: "선박건조공정",
          build: {
            steps: {
              1: inn.steps[0], 2: inn.steps[1], 3: inn.steps[2], 4: inn.steps[3],
              5: inn.steps[4], 6: inn.steps[5], 7: inn.steps[6], 8: inn.steps[7]
            }
          }
        };
        await fetch("/api/stage-activities", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
        }).catch(() => {});
      }
      alert("내부: 저장 완료(미리보기 반영).");
      localStorage.setItem(LS_KEY, JSON.stringify({ ext, inn }));
    } catch {
      alert("내부 저장 요청 실패(서버 미응답). 미리보기만 반영되었습니다.");
    } finally {
      setInLoading(false);
    }
  };

  // ============================
  // 표에 표시할 데이터 만들기
  // 외부: 값이 비거나 0이면 제외
  // 내부: 값이 비어있으면 제외(0은 표시)
  // ============================
  const summaryRows = [];
  if (lastSavedExt) {
    EXT_LABELS.forEach((label, i) => {
      const v = lastSavedExt.items?.[i];
      const s = String(v ?? "").trim();
      if (s === "") return;                 // 비어있으면 제외
      const n = toNum(s);
      if (!Number.isFinite(n) || n === 0) return; // 0 또는 NaN이면 제외
      summaryRows.push({
        type: "외부",
        shipKey: lastSavedExt.shipKey || "—",
        start: lastSavedExt.startDate || "—",
        end: lastSavedExt.endDate || "—",
        name: label,
        value: v
      });
    });
  }
  if (lastSavedInn) {
    INT_LABELS.forEach((label, i) => {
      const v = lastSavedInn.steps?.[i];
      const s = String(v ?? "").trim();
      if (s === "") return; // 내부는 비어있을 때만 제외(0은 표시)
      summaryRows.push({
        type: "내부",
        shipKey: lastSavedInn.shipKey || "—",
        start: lastSavedInn.startDate || "—",
        end: lastSavedInn.endDate || "—",
        name: label,
        value: v
      });
    });
  }

  return (
    <div className="carb1-container">
      {/* ========== 외부 ========== */}
      <section className="card">
        <h3 className="section-title">① 외부 업체 (일부 칸 비워도 저장 가능)</h3>
        <form onSubmit={submitExternal} style={{ display: "grid", gap: 12 }}>
          <div className="grid-2">
            <div className="field">
              <label className="label">선박 식별자 (문자/숫자 모두 허용)</label>
              <input
                className="input"
                type="text" name="shipKey" value={ext.shipKey} onChange={onChangeExt}
                placeholder="예: 1, KOR-AB12, ANY-CODE-123" required
              />
            </div>
            <div className="field" />
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="label">시작일</label>
              <input className="date" type="date" name="startDate" value={ext.startDate} onChange={onChangeExt} required />
            </div>
            <div className="field">
              <label className="label">종료일</label>
              <input className="date" type="date" name="endDate" value={ext.endDate} onChange={onChangeExt} min={ext.startDate || undefined} required />
            </div>
          </div>

          <div className="grid-2">
            {EXT_LABELS.map((label, i) => (
              <div className="field" key={i}>
                <label className="label">{label} <small>(단위 t)</small></label>
                <input
                  className={`input numeric ${extErrs[i] ? "input-error" : ""}`}
                  type="text" inputMode="decimal"
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
            {extLoading ? "저장 중..." : "외부 DB 저장"}
          </button>
        </form>
      </section>

      {/* ========== 내부 ========== */}
      <section className="card">
        <h3 className="section-title">② 조선소 내부 정보 입력</h3>
        <form onSubmit={submitInternal} style={{ display: "grid", gap: 12 }}>
          <div className="grid-2">
            <div className="field">
              <label className="label">선박 식별자 (문자/숫자 모두 허용)</label>
              <input
                className="input"
                type="text" name="shipKey" value={inn.shipKey} onChange={onChangeInn}
                placeholder="예: 1, KOR-AB12, ANY-CODE-123" required
              />
            </div>
            <div className="field" />
          </div>

          <div className="grid-2">
            <div className="field">
              <label className="label">시작일</label>
              <input className="date" type="date" name="startDate" value={inn.startDate} onChange={onChangeInn} required />
            </div>
            <div className="field">
              <label className="label">종료일</label>
              <input className="date" type="date" name="endDate" value={inn.endDate} onChange={onChangeInn} min={inn.startDate || undefined} required />
            </div>
          </div>

          <div className="grid-2">
            {INT_LABELS.map((label, i) => (
              <div className="field" key={i}>
                <label className="label">{label} <small>(단위 t)</small></label>
                <input
                  className={`input numeric ${innErrs[i] ? "input-error" : ""}`}
                  type="text" inputMode="decimal"
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
            {inLoading ? "저장 중..." : "내부 DB 저장"}
          </button>
        </form>
      </section>

      {/* ========== 요약 표(최근 저장본만 표시) ========== */}
      <section className="card">
        <h3 className="section-title">입력 요약</h3>
        {summaryRows.length === 0 ? (
          <div className="help">* 아직 저장된 데이터가 없습니다. 위에서 “저장”을 누르면 여기에 표시됩니다.</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>구분</th>
                  <th>선박 식별자</th>
                  <th>시작일</th>
                  <th>종료일</th>
                  <th>항목/단계</th>
                  <th>값</th>
                </tr>
              </thead>
              <tbody>
                {summaryRows.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.type}</td>
                    <td>{row.shipKey}</td>
                    <td>{row.start}</td>
                    <td>{row.end}</td>
                    <td>{row.name}</td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
