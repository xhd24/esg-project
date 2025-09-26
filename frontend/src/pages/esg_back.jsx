// src/pages/ESGBack.jsx
import { useNavigate } from "react-router-dom";
import "./css/Carb1.css"; // 버튼/카드 스타일 재사용 (선택)
import "./css/report.back.css";


export default function ESGBack() {
  const navigate = useNavigate();

  return (
    <div className="carb1-container">
      <section className="card">
        <h2 className="section-title">탄소배출량 안내</h2>
        <p>
 여기에서 <strong>내부/외부 공정 배출량</strong>과 <strong>운항 배출량</strong> 입력 화면으로 이동할 수 있어요.
</p>


        {/* C1/C2/C3 탭 레이아웃으로 이동 */}
        <button className="btn-primary" onClick={() => navigate("/carbon/forms")}>
          입력 시작하기
        </button>
      </section>
    </div>
  );
}