import { useState, useEffect } from "react";
import { getCarbon } from "../api.js";
import "./css/C1Result.css";

import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  LineChart, Line
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function C2Result() {
  const [gradeData, setGradeData] = useState([]);
  const [shipData, setShipData] = useState([]);
  const [trendData, setTrendData] = useState([]);

  const userId = sessionStorage.getItem('userKey');

  useEffect(() => {
    getCarbon(userId).then((res) => {
      const posts2 = res.posts2 || [];

      // 문자열 → 숫자 변환
      const toNum = (v) => Number(String(v ?? "0").replace(/,/g, ""));

      // A. grade 등급별 배출량 합계 (PieChart)
      const gradeTotals = {};
      posts2.forEach((p) => {
        const g = p.grade || "등급없음";
        const tco2 = toNum(p.tco2);
        gradeTotals[g] = (gradeTotals[g] || 0) + tco2;
      });
      setGradeData(
        Object.entries(gradeTotals).map(([grade, value]) => ({
          name: grade,
          value,
        }))
      );

      // B. ship_id별 배출량 합계 (BarChart)
      const ships = {};
      posts2.forEach((p) => {
        const ship = p.ship_id;
        const tco2 = toNum(p.tco2);
        if (!ships[ship]) {
          ships[ship] = { ship_id: ship, 배출량: 0 };
        }
        ships[ship].배출량 += tco2;
      });
      setShipData(Object.values(ships));

      // C. 기간별 배출량 추세 (LineChart, start_date 기준)
      const byDate = {};
      posts2.forEach((p) => {
        const date = p.start_date?.slice(0, 10) || "날짜없음";
        const tco2 = toNum(p.tco2);
        if (!byDate[date]) {
          byDate[date] = { date, 배출량: 0 };
        }
        byDate[date].배출량 += tco2;
      });
      const sorted = Object.values(byDate).sort((a, b) =>
        a.date.localeCompare(b.date)
      );
      setTrendData(sorted);
    });
  }, []);

  return (
    <div className="c1r-wrap">
      {/* 상단 2개 박스 */}
      <div className="c1r-top">
        {/* 결과 A */}
        <section className="c1r-card c1r-square">
          <h4 className="c1r-title">결과 A (등급별 CO₂ 배출량)</h4>
          <div className="c1r-body">
            {gradeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradeData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={120}
                    label
                  >
                    {gradeData.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>데이터가 없습니다.</p>
            )}
          </div>
        </section>

        {/* 결과 B */}
        <section className="c1r-card c1r-square">
          <h4 className="c1r-title">결과 B (선박별 CO₂ 배출량)</h4>
          <div className="c1r-body">
            {shipData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={shipData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ship_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="배출량" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>데이터가 없습니다.</p>
            )}
          </div>
        </section>
      </div>

      {/* 결과 C */}
      <div className="c1r-bottom">
        <section className="c1r-card c1r-rect">
          <h4 className="c1r-title">결과 C (기간별 CO₂ 배출량 추세)</h4>
          <div className="c1r-body">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="배출량" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>데이터가 없습니다.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
