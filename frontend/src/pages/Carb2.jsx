// src/pages/Carb2.jsx
import { useState, useEffect } from "react";
import "./css/Carb1.css"; // Carb1에서 만든 초록 테마 CSS 재사용

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

function Carb2() {
  const CATEGORY = "운용"; // 고정

  const [form, setForm] = useState({
    shipKey: "",            // shipId(숫자) 또는 shipCode(문자)
    startDate: "",
    endDate: "",
    energyType: "MGO",      // 연료만: MGO/HFO/LNG
    amount: "",             // 연료 사용량 (L, LNG만 kg) -> 콤마 표시
    distanceNm: "",         // 운항거리 (nm) -> 정수 콤마
    capacityTon: ""         // 적재능력 (ton DWT) -> 정수 콤마
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const today = `${yyyy}-${mm}-${dd}`;
    setForm(f => ({ ...f, startDate: today, endDate: today }));
  }, []);

  const onChangeBasic = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const onChangeAmount = (e) => {
    const { value } = e.target;
    setForm(f => ({ ...f, amount: formatNumericWithComma(value) }));
  };
  const onChangeDistance = (e) => {
    const { value } = e.target;
    setForm(f => ({ ...f, distanceNm: formatIntWithComma(value) }));
  };
  const onChangeCapacity = (e) => {
    const { value } = e.target;
    setForm(f => ({ ...f, capacityTon: formatIntWithComma(value) }));
  };

  // 날짜 범위 -> 날짜 배열
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

  const onSubmit = async e => {
    e.preventDefault();

    // 기본 검증
    if (!form.shipKey.trim()) return alert("선박 식별자(shipId/코드)를 입력하세요.");
    if (!form.startDate || !form.endDate) return alert("기간을 선택하세요.");
    if (form.endDate < form.startDate) return alert("종료일이 시작일보다 빠릅니다.");
    if (!["MGO","HFO","LNG"].includes(form.energyType)) return alert("연료를 선택하세요.");

    const amount = toNumber(form.amount);
    if (!(amount > 0)) return alert("연료 사용량은 0보다 커야 합니다.");
    const distanceNm = toNumber(form.distanceNm);
    const capacityTon = toNumber(form.capacityTon);
    if (!(distanceNm > 0)) return alert("운항거리를 입력하세요.");
    if (!(capacityTon > 0)) return alert("적재능력을 입력하세요.");

    // 선박 식별자: 숫자만이면 shipId, 아니면 shipCode로 보냄
    const numericOnly = /^\d+$/.test(form.shipKey.trim());
    const shipPayload = numericOnly
      ? { shipId: Number(form.shipKey.trim()) }
      : { shipCode: form.shipKey.trim() };

    // 연료 라인
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
          category: CATEGORY,        // 운용 고정
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
      setForm(f => ({ ...f, shipKey: "", amount: "", distanceNm: "", capacityTon: "" }));
    } catch (err) {
      alert("저장 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 단위 표기 (연료만)
  const unit = form.energyType === "LNG" ? "kg" : "L";

  // 미리보기
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
        <h2 className="section-title">Carb2 입력 (운용 · 기간 · 연료만)</h2>

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
            />
          </div>

          {/* date range */}
          <div className="grid-2">
            <div className="field">
              <div className="label">운항 시작일</div>
              <input className="date" name="startDate" value={form.startDate} onChange={onChangeBasic} type="date" />
            </div>
            <div className="field">
              <div className="label">운항 종료일</div>
              <input className="date" name="endDate" value={form.endDate} onChange={onChangeBasic} type="date" min={form.startDate || undefined} />
            </div>
          </div>

          {/* energyType (전기 제거, 연료만) */}
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
              placeholder={unit === "kg" ? "예: 120.000" : "예: 4,500.000"}
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
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "저장 중..." : "DB 저장"}
          </button>

          {/* ======== 미리보기 표 (저장 버튼 아래) ======== */}
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
            <div className="help">* DB 연결 전이라도, 입력 값이 실시간으로 표시돼.</div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Carb2;
