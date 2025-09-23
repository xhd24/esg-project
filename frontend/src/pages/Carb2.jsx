// src/pages/Carb2.jsx
import { useState, useEffect, useRef } from "react";
import "./css/Carb1.css";

function sanitizeNumeric(input) {
  if (input == null) return "";
  let s = String(input).replace(/[^0-9.]/g, "");
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
function formatIntWithComma(input) {
  const s = String(input ?? "").replace(/[^0-9]/g, "");
  if (!s) return "";
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
const toNumber = (s) => Number(String(s ?? "").replace(/,/g, "") || 0);

// ---------- 로컬스토리지 키 / 버전 ----------
const LS_KEY = "carb2_form_v1";

function Carb2() {
  const CATEGORY = "운용";

  const [form, setForm] = useState({
    shipKey: "",
    startDate: "",
    endDate: "",
    energyType: "MGO", // MGO/HFO/LNG
    amount: "",        // ton (콤마 표시)
    distanceNm: "",    // nm (정수 콤마)
    capacityTon: ""    // ton DWT (정수 콤마)
  });
  const [loading, setLoading] = useState(false);

  // ---------- 1) 마운트 시 복원 ----------
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // 잘못된 값 방지용: 키만 덮어쓰기
        setForm((prev) => ({ ...prev, ...parsed }));
      } else {
        // 저장값 없으면 오늘 날짜 기본 세팅
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const today = `${yyyy}-${mm}-${dd}`;
        setForm((f) => ({ ...f, startDate: today, endDate: today }));
      }
    } catch (_) {
      // 파싱 실패 등은 무시하고 오늘 날짜 세팅
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const today = `${yyyy}-${mm}-${dd}`;
      setForm((f) => ({ ...f, startDate: today, endDate: today }));
    }
  }, []);

  // ---------- 2) 변경 시 자동 저장 (디바운스 300ms) ----------
  const saveTimer = useRef(null);
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        // 민감정보가 아니라면 그대로 저장
        localStorage.setItem(LS_KEY, JSON.stringify(form));
      } catch (_) {}
    }, 300);
    return () => clearTimeout(saveTimer.current);
  }, [form]);

  const onChangeBasic = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };
  const onChangeAmount = (e) => {
    setForm((f) => ({ ...f, amount: formatNumericWithComma(e.target.value) }));
  };
  const onChangeDistance = (e) => {
    setForm((f) => ({ ...f, distanceNm: formatIntWithComma(e.target.value) }));
  };
  const onChangeCapacity = (e) => {
    setForm((f) => ({ ...f, capacityTon: formatIntWithComma(e.target.value) }));
  };

  const isReady =
    form.shipKey.trim().length > 0 &&
    form.startDate &&
    form.endDate &&
    ["MGO", "HFO", "LNG"].includes(form.energyType) &&
    form.amount.trim().length > 0 &&
    form.distanceNm.trim().length > 0 &&
    form.capacityTon.trim().length > 0;

  const daysBetween = (start, end) => {
    const out = [];
    const a = new Date(start + "T00:00:00");
    const b = new Date(end + "T00:00:00");
    for (let d = a; d <= b; d.setDate(d.getDate() + 1)) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      out.push(`${yyyy}-${mm}-${dd}`);
    }
    return out;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isReady) return;
    if (form.endDate < form.startDate) return alert("종료일이 시작일보다 빠릅니다.");

    const amount = toNumber(form.amount);       // ton
    const distanceNm = toNumber(form.distanceNm);
    const capacityTon = toNumber(form.capacityTon);
    if (!(amount > 0 && distanceNm > 0 && capacityTon > 0)) {
      return alert("모든 수치는 0보다 커야 합니다.");
    }

    const numericOnly = /^\d+$/.test(form.shipKey.trim());
    const shipPayload = numericOnly
      ? { shipId: Number(form.shipKey.trim()) }
      : { shipCode: form.shipKey.trim() };

    const line = { kind: "FUEL", fuelType: form.energyType, amount };
    const dates = daysBetween(form.startDate, form.endDate);

    try {
      setLoading(true);
      let totalInserted = 0;
      let totalCo2 = 0;

      for (const date of dates) {
        const payload = {
          ...shipPayload,
          date,
          stage: "운항",
          workTag: null,
          category: "운용",
          lines: [line],
          ops: { distance_nm: distanceNm, capacity_ton: capacityTon }
        };
        const r = await fetch("/api/stage-activities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "서버 오류");
        totalInserted += data.inserted || 0;
        totalCo2 += Number(data.total_co2_kg || 0);
      }

      alert(`저장 완료: ${totalInserted}건 · 총 CO₂ ${totalCo2.toFixed(6)} kg`);
      // 저장 후에도 입력 유지 원하면 아래 초기화 주석 처리
      setForm((f) => ({ ...f, shipKey: "", amount: "", distanceNm: "", capacityTon: "" }));
      // 초기화가 로컬스토리지에 즉시 반영되도록
      localStorage.setItem(LS_KEY, JSON.stringify({
        ...form, shipKey: "", amount: "", distanceNm: "", capacityTon: ""
      }));
    } catch (err) {
      alert("저장 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 단위 고정
  const unit = "ton";

  const preview = {
    shipKey: form.shipKey || "—",
    startDate: form.startDate || "—",
    endDate: form.endDate || "—",
    fuelType: form.energyType || "—",
    amount: form.amount ? `${form.amount} ${unit}` : "—",
    distanceNm: form.distanceNm ? `${form.distanceNm} nm` : "—",
    capacityTon: form.capacityTon ? `${form.capacityTon} ton` : "—"
  };

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
              <input type="radio" name="energyType" value="MGO"
                checked={form.energyType === "MGO"} onChange={onChangeBasic}/> MGO
            </label>{" "}
            <label style={{ marginRight: 12 }}>
              <input type="radio" name="energyType" value="HFO"
                checked={form.energyType === "HFO"} onChange={onChangeBasic}/> HFO
            </label>{" "}
            <label>
              <input type="radio" name="energyType" value="LNG"
                checked={form.energyType === "LNG"} onChange={onChangeBasic}/> LNG
            </label>
          </div>

          {/* amount */}
          <div className="field">
            <div className="label">
              연료 사용량 <small style={{ color: "#7b8f86" }}>(단위: {unit})</small>
            </div>
            <input
              className="input numeric"
              name="amount"
              value={form.amount}
              onChange={onChangeAmount}
              type="text"
              inputMode="decimal"
              placeholder="예: 4,500.000"
              required
            />
          </div>

          {/* distance & capacity */}
          <div className="grid-2">
            <div className="field">
              <div className="label">운항거리 (nm)</div>
              <input
                className="input numeric"
                name="distanceNm"
                value={form.distanceNm}
                onChange={onChangeDistance}
                type="text"
                inputMode="numeric"
                placeholder="예: 1,250"
                required
              />
            </div>
            <div className="field">
              <div className="label">적재능력 (ton DWT)</div>
              <input
                className="input numeric"
                name="capacityTon"
                value={form.capacityTon}
                onChange={onChangeCapacity}
                type="text"
                inputMode="numeric"
                placeholder="예: 52,000"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !isReady}
            title={!isReady ? "모든 값을 입력해야 저장할 수 있어요." : undefined}
          >
            {loading ? "저장 중..." : "DB 저장"}
          </button>

          {/* 미리보기 표 */}
          <div className="table-wrap" style={{ marginTop: 12 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>선박 식별자</th>
                  <th>운항 시작일</th>
                  <th>운항 종료일</th>
                  <th>연료의 종류</th>
                  <th>연료의 사용량</th>
                  <th>운항거리</th>
                  <th>적재능력</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{preview.shipKey}</td>
                  <td>{preview.startDate}</td>
                  <td>{preview.endDate}</td>
                  <td>{preview.fuelType}</td>
                  <td>{preview.amount}</td>
                  <td>{preview.distanceNm}</td>
                  <td>{preview.capacityTon}</td>
                </tr>
              </tbody>
            </table>
            <div className="help">* 페이지를 이동해도 입력값이 자동 저장됩니다.</div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Carb2;
