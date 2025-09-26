// src/pages/C1.result.jsx
import "./css/C1Result.css";

export default function C1Result() {
  return (
    <div className="c1r-wrap">
      {/* 상단: 정사각형 느낌 카드 2개 */}
      <div className="c1r-top">
        <div className="c1r-card c1r-square">
          <h4 className="c1r-title">결과 Aq</h4>
          <div className="c1r-body">여기에 A 결과/지표/차트 등을 표시</div>
        </div>
        <div className="c1r-card c1r-square">
          <h4 className="c1r-title">결과 B</h4>
          <div className="c1r-body">여기에 B 결과/지표/차트 등을 표시</div>
        </div>
      </div>

      {/* 하단: 직사각형 1개 */}
      <div className="c1r-bottom">
        <div className="c1r-card c1r-rect">
          <h4 className="c1r-title">결과 C</h4>
          <div className="c1r-body">
            여기에 표/그래프/상세 리포트 등을 표시합니다.
          </div>
        </div>
      </div>
    </div>
  );
}
