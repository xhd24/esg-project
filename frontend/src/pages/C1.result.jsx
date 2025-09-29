import { useState, useEffect } from 'react';
import { getCarbon } from '../api.js';
import "./css/C1Result.css";
import Visualization from './Visualization.jsx';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

export default function C1Result() {
  const [extData, setExtData] = useState(null);
  const [innData, setInnData] = useState(null);
  const [shipCompare, setShipCompare] = useState([]);
  const [dateTrend, setDateTrend] = useState([]);
  const [activeTab, setActiveTab] = useState("ship"); // 탭 상태

  const userId = sessionStorage.getItem('userKey');

  useEffect(() => {
    getCarbon(userId).then((res) => {
      const posts = res.posts || [];

      // ==============================
      // A. 외부 합산 데이터 (PieChart)
      // ==============================
      const outs = posts.filter(p => p.io_type === "OUT");
      // 외부 합산
      if (outs.length > 0) {
        setExtData({
          items: [
            String(outs.reduce((sum, p) => sum + (p.out_step1 ?? 0), 0)),
            String(outs.reduce((sum, p) => sum + (p.out_step2 ?? 0), 0)),
            String(outs.reduce((sum, p) => sum + (p.out_step3 ?? 0), 0)),
            String(outs.reduce((sum, p) => sum + (p.out_step4 ?? 0), 0)),
            String(outs.reduce((sum, p) => sum + (p.out_step5 ?? 0), 0)),
          ]
        });
      }




      // ==============================
      // B. 내부 합산 데이터 (BarChart)
      // ==============================
      const ins = posts.filter(p => p.io_type === "IN");
      // 내부 합산
      if (ins.length > 0) {
        setInnData({
          steps: [
            String(ins.reduce((sum, p) => sum + (p.in_step1 ?? 0), 0)),
            String(ins.reduce((sum, p) => sum + (p.in_step2 ?? 0), 0)),
            String(ins.reduce((sum, p) => sum + (p.in_step3 ?? 0), 0)),
            String(ins.reduce((sum, p) => sum + (p.in_step4 ?? 0), 0)),
            String(ins.reduce((sum, p) => sum + (p.in_step5 ?? 0), 0)),
            String(ins.reduce((sum, p) => sum + (p.in_step6 ?? 0), 0)),
            String(ins.reduce((sum, p) => sum + (p.in_step7 ?? 0), 0)),
            String(ins.reduce((sum, p) => sum + (p.in_step8 ?? 0), 0)),
          ]
        });
      }

      // ==============================
      // C. 선박별 비교 (BarChart)
      // ==============================
      const groupedByShip = {};
      posts.forEach(p => {
        const ship = p.ship_id;
        if (!groupedByShip[ship]) {
          groupedByShip[ship] = { ship_id: ship, 외부합계: 0, 내부합계: 0 };
        }
        if (p.io_type === "OUT") {
          groupedByShip[ship].외부합계 +=
            (p.out_step1 ?? 0) + (p.out_step2 ?? 0) + (p.out_step3 ?? 0) +
            (p.out_step4 ?? 0) + (p.out_step5 ?? 0);
        }
        if (p.io_type === "IN") {
          groupedByShip[ship].내부합계 +=
            (p.in_step1 ?? 0) + (p.in_step2 ?? 0) + (p.in_step3 ?? 0) +
            (p.in_step4 ?? 0) + (p.in_step5 ?? 0) + (p.in_step6 ?? 0) +
            (p.in_step7 ?? 0) + (p.in_step8 ?? 0);
        }
      });
      setShipCompare(Object.values(groupedByShip));

      // ==============================
      // D. 기간별 추세 (LineChart)
      // ==============================
      const groupedByDate = {};
      posts.forEach(p => {
        const date = p.start_date?.slice(0, 10);
        if (!groupedByDate[date]) {
          groupedByDate[date] = { date, 외부합계: 0, 내부합계: 0 };
        }
        if (p.io_type === "OUT") {
          groupedByDate[date].외부합계 +=
            (p.out_step1 ?? 0) + (p.out_step2 ?? 0) + (p.out_step3 ?? 0) +
            (p.out_step4 ?? 0) + (p.out_step5 ?? 0);
        }
        if (p.io_type === "IN") {
          groupedByDate[date].내부합계 +=
            (p.in_step1 ?? 0) + (p.in_step2 ?? 0) + (p.in_step3 ?? 0) +
            (p.in_step4 ?? 0) + (p.in_step5 ?? 0) + (p.in_step6 ?? 0) +
            (p.in_step7 ?? 0) + (p.in_step8 ?? 0);
        }
      });
      const sortedTrend = Object.values(groupedByDate).sort((a, b) => a.date.localeCompare(b.date));
      setDateTrend(sortedTrend);
    });
  }, []);

  return (
    <div className="c1r-wrap">
      <div className="c1r-top">
        {/* A: 외부 합산 시각화 */}
        <div className="c1r-card c1r-square">
          <h4 className="c1r-title">결과 A (외부 합산)</h4>
          <div className="c1r-body">
            {extData ? (
              <div style={{ width: "100%", height: 300 }}>
                <Visualization lastSavedExt={extData} />
              </div>
            ) : (
              <p>외부 데이터가 없습니다.</p>
            )}
          </div>
        </div>

        {/* B: 내부 합산 시각화 */}
        <div className="c1r-card c1r-square">
          <h4 className="c1r-title">결과 B (내부 합산)</h4>
          <div className="c1r-body">
            {innData ? (
              <div style={{ width: "100%", height: 300 }}>
                <Visualization lastSavedInn={innData} />
              </div>
            ) : (
              <p>내부 데이터가 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      {/* C: 탭 - 선박별 / 기간별 */}
      <div className="c1r-bottom">
        <div className="c1r-card c1r-rect">
          <h4 className="c1r-title">결과 C (비교 분석)</h4>

          {/* 탭 버튼 */}
          <div className="c1r-tabs">
            <button
              className={activeTab === "ship" ? "active" : ""}
              onClick={() => setActiveTab("ship")}
            >
              선박별 비교
            </button>
            <button
              className={activeTab === "date" ? "active" : ""}
              onClick={() => setActiveTab("date")}
            >
              기간별 추세
            </button>
          </div>

          <div className="c1r-body" style={{ height: 400 }}>
            {activeTab === "ship" && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shipCompare}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ship_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="외부합계" fill="#8884d8" />
                  <Bar dataKey="내부합계" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeTab === "date" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dateTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="외부합계" stroke="#8884d8" />
                  <Line type="monotone" dataKey="내부합계" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
