import { useState, useEffect } from "react";

function Carb2() {
  const CATEGORY = "운용"; // 고정

  const [form, setForm] = useState({
    shipKey: "",            // shipId(숫자) 또는 shipCode(문자)
    startDate: "",
    endDate: "",
    energyType: "MGO",      // 연료만: MGO/HFO/LNG
    amount: "",             // 연료 사용량 (단위: ton, 소수 가능)
    distanceNm: "",         // 운항거리 (nm, 정수)
    capacityTon: ""         // 적재능력 (ton DWT, 정수)
  });
  const [loading, setLoading] = useState(false);

  // 숫자 포맷/파싱 유틸
  const formatWithComma = (raw, allowDecimal = true) => {
    if (raw == null) return "";
    // 콤마 제거
    let s = String(raw).replace(/,/g, "");
    // 숫자와 .만 남기기 (소수점 하나 허용)
    s = allowDecimal ? s.replace(/[^0-9.]/g, "") : s.replace(/[^0-9]/g, "");
    const parts = s.split(".");
    const intPart = parts[0] || "0";
    const decPart = allowDecimal && parts[1] !== undefined ? parts[1] : undefined;

    // 앞의 0들 정리 (단, '0'은 유지)
    const intNorm = intPart.replace(/^0+(?=\d)/, "");
    const withComma = intNorm.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";

    return decPart !== undefined ? `${withComma}.${decPart}` : withComma;
  };
  const parseNumber = (s) => Number(String(s || "").replace(/,/g, "") || 0);

  // 핸들러 (천단위 콤마 자동)
  const onChange = (e) => {
    const { name, value } = e.target;
    // 텍스트 필드 공통
    if (["shipKey", "startDate", "endDate", "energyType"].includes(name)) {
      setForm((f) => ({ ...f, [name]: value }));
      return;
    }
    // 숫자 필드 포맷
    if (name === "amount") {
      setForm((f) => ({ ...f, amount: formatWithComma(value, true) })); // 소수 허용
    } else if (name === "distanceNm" || name === "capacityTon") {
      setForm((f) => ({ ...f, [name]: formatWithComma(value, false) })); // 정수만
    }
  };

  useEffect(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const today = `${yyyy}-${mm}-${dd}`;
    setForm((f) => ({ ...f, startDate: today, endDate: today }));
  }, []);

  // 날짜 범위 -> 배열
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

    // 기본 검증
    if (!form.shipKey.trim()) return alert("선박 식별자(shipId/코드)를 입력하세요.");
    if (!form.startDate || !form.endDate) return alert("기간을 선택하세요.");
    if (form.endDate < form.startDate) return alert("종료일이 시작일보다 빠릅니다.");
    if (!["MGO", "HFO", "LNG"].includes(form.energyType)) return alert("연료를 선택하세요.");

    const amountNum = parseNumber(form.amount);
    const distanceNmNum = parseNumber(form.distanceNm);
    const capacityTonNum = parseNumber(form.capacityTon);

    if (!(amountNum > 0)) return alert("연료 사용량(ton)은 0보다 커야 합니다.");
    if (!(distanceNmNum > 0)) return alert("운항거리(nm)를 입력하세요.");
    if (!(capacityTonNum > 0)) return alert("적재능력(ton)을 입력하세요.");

    // shipId/shipCode 분기
    const numericOnly = /^\d+$/.test(form.shipKey.trim());
    const shipPayload = numericOnly
      ? { shipId: Number(form.shipKey.trim()) }
      : { shipCode: form.shipKey.trim() };

    // 연료 라인 (단위: ton)
    const line = { kind: "FUEL", fuelType: form.energyType, amount: amountNum };

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
          category: CATEGORY,
          lines: [line],
          ops: {
            distance_nm: distanceNmNum,
            capacity_ton: capacityTonNum
          }
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
      // 입력 일부 초기화(기간은 유지)
      setForm((f) => ({
        ...f,
        shipKey: "",
        amount: "",
        distanceNm: "",
        capacityTon: ""
      }));
    } catch (err) {
      alert("저장 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 단위 표기: 모두 ton
  const unit = "ton";

  // 미리보기 (콤마 유지)
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
    <div style={{ padding: "8px 16px", maxWidth: 860 }}>
      <h2 style={{ marginTop: 4 }}>Carb2 입력 (운용 · 기간 · 연료 단위 TON, 천단위 콤마)</h2>

      <div style={{ minHeight: "66vh" }}>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          {/* shipKey */}
          <div>
            <div style={{ marginBottom: 6 }}>선박 식별자 (shipId 또는 코드)</div>
            <input
              name="shipKey"
              value={form.shipKey}
              onChange={onChange}
              type="text"
              placeholder="예: 1 또는 KOR-AB12"
              autoComplete="off"
            />
          </div>

          {/* date range */}
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
            <div>
              <div style={{ marginBottom: 6 }}>운항 시작일</div>
              <input name="startDate" value={form.startDate} onChange={onChange} type="date" />
            </div>
            <div>
              <div style={{ marginBottom: 6 }}>운항 종료일</div>
              <input
                name="endDate"
                value={form.endDate}
                onChange={onChange}
                type="date"
                min={form.startDate || undefined}
              />
            </div>
          </div>

          {/* fuel type */}
          <div>
            <div style={{ marginBottom: 6 }}>연료</div>
            <label>
              <input
                type="radio"
                name="energyType"
                value="MGO"
                checked={form.energyType === "MGO"}
                onChange={onChange}
              />{" "}
              MGO
            </label>{" "}
            <label>
              <input
                type="radio"
                name="energyType"
                value="HFO"
                checked={form.energyType === "HFO"}
                onChange={onChange}
              />{" "}
              HFO
            </label>{" "}
            <label>
              <input
                type="radio"
                name="energyType"
                value="LNG"
                checked={form.energyType === "LNG"}
                onChange={onChange}
              />{" "}
              LNG
            </label>
          </div>

          {/* amount (ton, 소수 허용) */}
          <div>
            <div style={{ marginBottom: 6 }}>
              연료 사용량 <small style={{ color: "#888" }}>(단위: {unit})</small>
            </div>
            <input
              name="amount"
              value={form.amount}
              onChange={onChange}
              type="text"                 // 콤마 입력 위해 text 사용
              inputMode="decimal"
              placeholder="예: 4,500.000"
            />
          </div>

          {/* distance & capacity (정수, 콤마) */}
          <div style={{ display: "grid", gap: 8, gridTemplateColumns: "1fr 1fr" }}>
            <div>
              <div style={{ marginBottom: 6 }}>운항거리 (nm)</div>
              <input
                name="distanceNm"
                value={form.distanceNm}
                onChange={onChange}
                type="text"
                inputMode="numeric"
                placeholder="예: 1,250"
              />
            </div>
            <div>
              <div style={{ marginBottom: 6 }}>적재능력 (ton DWT)</div>
              <input
                name="capacityTon"
                value={form.capacityTon}
                onChange={onChange}
                type="text"
                inputMode="numeric"
                placeholder="예: 52,000"
              />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "저장 중..." : "DB 저장"}
          </button>

          {/* 미리보기 표 */}
          <div style={{ marginTop: 16 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #2a3344"
              }}
            >
              <thead>
                <tr style={{ background: "#0b1220", color: "#9fb4cc" }}>
                  <th style={th}>선박 식별자</th>
                  <th style={th}>운항 시작일</th>
                  <th style={th}>운항 종료일</th>
                  <th style={th}>연료의 종류</th>
                  <th style={th}>연료의 사용량</th>
                  <th style={th}>운항거리</th>
                  <th style={th}>적재능력</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={td}>{preview.shipKey}</td>
                  <td style={td}>{preview.startDate}</td>
                  <td style={td}>{preview.endDate}</td>
                  <td style={td}>{preview.fuelType}</td>
                  <td style={td}>{preview.amount}</td>
                  <td style={td}>{preview.distanceNm}</td>
                  <td style={td}>{preview.capacityTon}</td>
                </tr>
              </tbody>
            </table>
            <div style={{ fontSize: 12, color: "#7a8aa6", marginTop: 6 }}>
              * DB 연결 전이라도, 입력 칸의 현재 값이 실시간으로 표시됩니다.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const th = { padding: "8px 10px", border: "1px solid #2a3344", textAlign: "left" };
const td = { padding: "8px 10px", border: "1px solid #2a3344" };

export default Carb2;
