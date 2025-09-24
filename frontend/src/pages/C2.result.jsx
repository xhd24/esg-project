// src/pages/C2Result.jsx
import "./css/C1Result.css"; // C1에서 쓰던 CSS 그대로 재사용

export default function C2Result() {
  return (
    <div className="c1r-wrap">
      {/* 상단 2개 박스 */}
      <div className="c1r-top">
        <section className="c1r-card c1r-square">
          <h4 className="c1r-title">결과 A</h4>
          <div className="c1r-body">
            상단 좌측 컨텐츠 영역 (그래프/수치/요약 등)
          </div>
        </section>

        <section className="c1r-card c1r-square">
          <h4 className="c1r-title">결과 B</h4>
          <div className="c1r-body">
            상단 우측 컨텐츠 영역 (그래프/수치/요약 등)
          </div>
        </section>
      </div>

      {/* 하단 1개 박스 */}
      <div className="c1r-bottom">
        <section className="c1r-card c1r-rect">
          <h4 className="c1r-title">결과 C</h4>
          <div className="c1r-body">
            하단 넓은 컨텐츠 영역 (테이블/추세/설명 등)
          </div>
        </section>
      </div>
    </div>
  );
}
