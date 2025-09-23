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

// 숫자만 허용(소수점 1개 허용)으로 정제
function sanitizeNumeric(input) {
  if (input == null) return "";
  let s = String(input).replace(/[^0-9.]/g, "");
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

// 원본(raw) 입력을 검사 → 포맷된 값 + 에러메시지
function validateNumericRaw(raw) {
  if (raw === "") return { formatted: "", error: null };
  const hasBadChar = /[^0-9.]/.test(raw);
  const dotCount = (raw.match(/\./g) || []).length;
  const startsWithDot = raw.startsWith(".");
  let error = null;
  if (hasBadChar) error = "숫자와 소수점만 입력 가능해요.";
  else if (dotCount > 1) error = "소수점은 1개만 사용할 수 있어요.";
  else if (startsWithDot) error = "소수점 앞에 숫자를 넣어주세요 (예: 0.5).";
  const formatted = formatNumericWithComma(raw);
  return { formatted, error };
}

// ----- 로컬스토리지 키 -----
const LS_KEY = "carb1_form_v1";
// 에러 사라지는 애니메이션 시간(ms)
const ERROR_FADE_MS = 300;
// 자동 숨김 대기 시간(ms)
const ERROR_AUTO_HIDE_MS = 3000;

function Carb1() {
  // ===== 외부 =====
  const [ext, setExt] = useState({
    shipKey: "",
    startDate: "",
    endDate: "",
    items: ["", "", "", "", ""]
  });
  const [extLoading, setExtLoading] = useState(false);
  const [extErrs, setExtErrs] = useState(["", "", "", "", ""]); // 각 항목 에러 메시지
  const [extErrLeaving, setExtErrLeaving] = useState([false, false, false, false, false]); // 페이드아웃 플래그
  // 에러 타이머들
  const extErrTimers = useRef({}); // { [idx]: { hideId, clearId } }

  // ===== 내부 =====
  const [inn, setInn] = useState({
    shipKey: "",
    startDate: "",
    endDate: "",
    steps: ["", "", "", "", "", "", "", ""]
  });
  const [inLoading, setInLoading] = useState(false);
  const [innErrs, setInnErrs] = useState(["", "", "", "", "", "", "", ""]);
  const [innErrLeaving, setInnErrLeaving] = useState([false, false, false, false, false, false, false, false]);
  const innErrTimers = useRef({}); // { [idx]: { hideId, clearId } }

  // ===== 마운트 시 복원 =====
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.ext) setExt((prev) => ({ ...prev, ...parsed.ext }));
        if (parsed.inn) setInn((prev) => ({ ...prev, ...parsed.inn }));
        return;
      }
    } catch (_) {}
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
      try {
        localStorage.setItem(LS_KEY, JSON.stringify({ ext, inn }));
      } catch (_) {}
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

  // 공통: 에러 타이머 초기화 함수
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

    // 값 세팅
    setExt((f) => {
      const next = f.items.slice();
      next[idx] = formatted;
      return { ...f, items: next };
    });

    // 기존 타이머/상태 초기화
    resetErrTimers(extErrTimers, idx);
    setExtErrLeaving((prev) => {
      const next = prev.slice();
      next[idx] = false;
      return next;
    });

    // 에러 세팅 및 자동 숨김 로직
    setExtErrs((errs) => {
      const next = errs.slice();
      next[idx] = error || "";
      return next;
    });

    if (error) {
      // 3초 후 → leaving true로 만들어 부드럽게 숨김
      const hideId = setTimeout(() => {
        setExtErrLeaving((prev) => {
          const next = prev.slice();
          next[idx] = true;
          return next;
        });
        // 페이드 시간 후 실제로 에러 제거
        const clearId = setTimeout(() => {
          setExtErrs((errs) => {
            const next = errs.slice();
            next[idx] = "";
            return next;
          });
          setExtErrLeaving((prev) => {
            const next = prev.slice();
            next[idx] = false;
            return next;
          });
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
    setInnErrLeaving((prev) => {
      const next = prev.slice();
      next[idx] = false;
      return next;
    });

    setInnErrs((errs) => {
      const next = errs.slice();
      next[idx] = error || "";
      return next;
    });

    if (error) {
      const hideId = setTimeout(() => {
        setInnErrLeaving((prev) => {
          const next = prev.slice();
          next[idx] = true;
          return next;
        });
        const clearId = setTimeout(() => {
          setInnErrs((errs) => {
            const next = errs.slice();
            next[idx] = "";
            return next;
          });
          setInnErrLeaving((prev) => {
            const next = prev.slice();
            next[idx] = false;
            return next;
          });
          resetErrTimers(innErrTimers, idx);
        }, ERROR_FADE_MS);
        innErrTimers.current[idx].clearId = clearId;
      }, ERROR_AUTO_HIDE_MS);
      innErrTimers.current[idx] = { hideId, clearId: null };
    }
  };

  // 필수값 체크
  const isExtReady =
    ext.shipKey.trim() &&
    ext.startDate && ext.endDate &&
    ext.items.every((v) => v.trim()) &&
    extErrs.every((m) => !m); // 에러 없을 때만 가능
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

  // 외부 저장
  const submitExternal = async (e) => {
    e.preventDefault();
    if (ext.endDate < ext.startDate) return alert("외부: 종료일이 시작일보다 빠릅니다.");
    try {
      setExtLoading(true);
      const shipPayload = /^\d+$/.test(ext.shipKey.trim())
        ? { shipId: Number(ext.shipKey.trim()) }
        : { shipCode: ext.shipKey.trim() };
      let inserted = 0, totalCo2 = 0;
      for (const date of days(ext.startDate, ext.endDate)) {
        const payload = {
          ...shipPayload,
          date,
          category: "외부업체",
          stage: "선박건조공정",
          lifecycle: {
            items: {
              1: ext.items[0], 2: ext.items[1], 3: ext.items[2], 4: ext.items[3], 5: ext.items[4]
            }
          }
        };
        const r = await fetch("/api/stage-activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "서버 오류");
        inserted += data.inserted || 0;
        totalCo2 += Number(data.total_co2_kg || 0);
      }
      alert(`외부 저장 완료: ${inserted}건 · 총 CO₂ ${totalCo2.toFixed(6)} kg`);
      localStorage.setItem(LS_KEY, JSON.stringify({ ext, inn }));
    } catch (err) {
      alert("외부 저장 실패: " + (err?.message || err));
    } finally {
      setExtLoading(false);
    }
  };

  // 내부 저장
  const submitInternal = async (e) => {
    e.preventDefault();
    if (inn.endDate < inn.startDate) return alert("내부: 종료일이 시작일보다 빠릅니다.");
    try {
      setInLoading(true);
      const shipPayload = /^\d+$/.test(inn.shipKey.trim())
        ? { shipId: Number(inn.shipKey.trim()) }
        : { shipCode: inn.shipKey.trim() };
      let inserted = 0, totalCo2 = 0;
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
        const r = await fetch("/api/stage-activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "서버 오류");
        inserted += data.inserted || 0;
        totalCo2 += Number(data.total_co2_kg || 0);
      }
      alert(`내부 저장 완료: ${inserted}건 · 총 CO₂ ${totalCo2.toFixed(6)} kg`);
      localStorage.setItem(LS_KEY, JSON.stringify({ ext, inn }));
    } catch (err) {
      alert("내부 저장 실패: " + (err?.message || err));
    } finally {
      setInLoading(false);
    }
  };

  // 요약 표 데이터
  const summaryRows = [
    ...EXT_LABELS.map((label, i) => ({
      type: "외부",
      shipKey: ext.shipKey || "—",
      start: ext.startDate || "—",
      end: ext.endDate || "—",
      name: label,
      value: ext.items[i] || "—"
    })),
    ...INT_LABELS.map((label, i) => ({
      type: "내부",
      shipKey: inn.shipKey || "—",
      start: inn.startDate || "—",
      end: inn.endDate || "—",
      name: label,
      value: inn.steps[i] || "—"
    }))
  ];

  return (
    <div className="carb1-container">
      {/* ========== 외부 ========== */}
      <section className="card">
        <h3 className="section-title">① 외부 업체 (모든 칸 필수)</h3>

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
                  required
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
        <h3 className="section-title">② 조선소 내부 정보 입력 (모든 칸 필수)</h3>

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

      {/* ========== 요약 표(1개) ========== */}
      <section className="card">
        <h3 className="section-title">입력 요약</h3>
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
        <div className="help">* 페이지를 이동해도 입력 값이 자동 저장됩니다.</div>
      </section>
    </div>
  );
}

export default Carb1;
