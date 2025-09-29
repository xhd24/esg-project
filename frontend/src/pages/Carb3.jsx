import { useEffect, useState } from "react";
import { getCarbon } from '../api.js';
import styles from './css/carb3.module.css';

function Carb3() {
  const [table1, setTable1] = useState([]);
  const [table2, setTable2] = useState([]);
  const user = sessionStorage.getItem('userKey');

  useEffect(() => {
    getCarbon(user).then((res)=>{
      setTable1(res.posts || []);
      setTable2(res.posts2 || []);
    });
  }, []);

  return (
    <div className={styles["table-wrapper"]}>
      
      {/* 외부 업체 탄소 배출량 */}
      <div className={styles.card}>
        <h2 className={styles["section-title"]}> 외부 업체 탄소 배출량</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <td>선박 식별자</td>
              <td>시작일</td>
              <td>종료일</td>
              <td>원자재 채취 (t)</td>
              <td>기자재 제조 (t)</td>
              <td>원자재 및 기자재 운송 (t)</td>
              <td>선박 폐기 (t)</td>
              <td>재활용 (t)</td>
            </tr>
          </thead>
          <tbody>
            {table1
              .filter((v) => v.io_type === 'OUT')
              .slice(0, 5)  
              .map((v) => (
                <tr key={v.ci_id}>
                  <td data-label="선박 식별자">{v.ship_id}</td>
                  <td data-label="시작일">{v.start_date.split('T')[0]}</td>
                  <td data-label="종료일">{v.end_date.split('T')[0]}</td>
                  <td data-label="원자재 채취">{v.out_step1}</td>
                  <td data-label="기자재 제조">{v.out_step2}</td>
                  <td data-label="운송">{v.out_step3}</td>
                  <td data-label="선박 폐기">{v.out_step4}</td>
                  <td data-label="재활용">{v.out_step5}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* 조선소 내부 탄소 배출량 */}
      <div className={styles.card}>
        <h2 className={styles["section-title"]}>조선소 내부 탄소 배출량</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <td>선박 식별자</td>
              <td>시작일</td>
              <td>종료일</td>
              <td>설계 (t)</td>
              <td>강재적치 (t)</td>
              <td>강재절단 (t)</td>
              <td>조립 (t)</td>
              <td>의장 (t)</td>
              <td>탑재 (t)</td>
              <td>안벽작업 (t)</td>
              <td>시운전 (t)</td>
            </tr>
          </thead>
          <tbody>
            {table1
              .filter((v) => v.io_type === 'IN')
              .slice(0, 5)  
              .map((v) => (
                <tr key={v.ci_id}>
                  <td data-label="선박 식별자">{v.ship_id}</td>
                  <td data-label="시작일">{v.start_date.split('T')[0]}</td>
                  <td data-label="종료일">{v.end_date.split('T')[0]}</td>
                  <td data-label="설계">{v.in_step1}</td>
                  <td data-label="강재적치">{v.in_step2}</td>
                  <td data-label="강재절단">{v.in_step3}</td>
                  <td data-label="조립">{v.in_step4}</td>
                  <td data-label="의장">{v.in_step5}</td>
                  <td data-label="탑재">{v.in_step6}</td>
                  <td data-label="안벽작업">{v.in_step7}</td>
                  <td data-label="시운전">{v.in_step8}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className={styles.card}>
        <h2 className={styles["section-title"]}>운항 탄소 배출량</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <td>선박 식별자</td>
              <td>운항 시작일</td>
              <td>운항 종료일</td>
              <td>연료</td>
              <td>연료 사용량 (t)</td>
              <td>운항거리 (nm)</td>
              <td>적재능력 (ton DWT)</td>
            </tr>
          </thead>
          <tbody>
            {table2
              .slice(0, 5)  
              .map((v) => (
                <tr key={v.cii_id}>
                  <td data-label="선박 식별자">{v.ship_id}</td>
                  <td data-label="운항 시작일">{v.start_date.split('T')[0]}</td>
                  <td data-label="운항 종료일">{v.end_date.split('T')[0]}</td>
                  <td data-label="연료">{v.fuel_type}</td>
                  <td data-label="연료 사용량">{v.fuel_tons}</td>
                  <td data-label="운항거리">{v.distance_nm}</td>
                  <td data-label="적재능력">{v.capacity_ton}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Carb3;
