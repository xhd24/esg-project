import { useEffect, useState } from "react";
import { deleteC1row, getCarbon, editC1row, editC2row, editC3row, deleteC3row } from '../api.js';
import styles from './css/carb3.module.css';

function Carb3() {
  const [table1, setTable1] = useState([]);
  const [table2, setTable2] = useState([]);
  const user = sessionStorage.getItem('userKey');

  useEffect(() => {
    getCarbon(user).then((res) => {
      setTable1(res.posts || []);
      setTable2(res.posts2 || []);
    });
  }, []);

  //1번 테이블 수정
  const [editRow, setEditRow] = useState(null);
  const [editC1, setEditC1] = useState({
    c1_id: '', c1_1: '', c1_2: '', c1_3: '', c1_4: '', c1_5: '', c1_6: '', c1_7: '', c1_8: '',
  });
  const handleC1Delete = async (ci_id) => {
    try {
      await deleteC1row(ci_id);
      setTable1((prev) => prev.filter((row) => row.ci_id !== ci_id));
    } catch (err) {
      console.error('삭제 실패');
    }
  }
  const c1EditSave = async () => {
    try {
      await editC1row({ ...editC1, c1_id: editRow });
      setTable1(prev =>
        prev.map(row =>
          row.ci_id === editRow
            ? {
              ...row,
              ship_id: editC1.c1_1,
              start_date: editC1.c1_2,
              end_date: editC1.c1_3,
              out_step1: editC1.c1_4,
              out_step2: editC1.c1_5,
              out_step3: editC1.c1_6,
              out_step4: editC1.c1_7,
              out_step5: editC1.c1_8,
            }
            : row
        )
      );
      setEditC1({ c1_id: '', c1_1: '', c1_2: '', c1_3: '', c1_4: '', c1_5: '', c1_6: '', c1_7: '', c1_8: '' });
      setEditRow(null);
    } catch (err) {
      console.error('수정 실패');
    }
  }

  //2번 테이블 수정
  const [editRow2, setEditRow2] = useState(null);
  const [editC2, setEditC2] = useState({
    c2_id: '', c2_1: '', c2_2: '', c2_3: '', c2_4: '', c2_5: '', c2_6: '', c2_7: '', c2_8: '', c2_9: '', c2_10: '', c2_11: '',
  })
  const c2EditSave = async () => {
    try {
      await editC2row({ ...editC2, c2_id: editRow2 });
      setTable1(prev =>
        prev.map(row =>
          row.ci_id === editRow2
            ? {
              ...row,
              ship_id: editC2.c2_1,
              start_date: editC2.c2_2,
              end_date: editC2.c2_3,
              in_step1: editC2.c2_4,
              in_step2: editC2.c2_5,
              in_step3: editC2.c2_6,
              in_step4: editC2.c2_7,
              in_step5: editC2.c2_8,
              in_step6: editC2.c2_9,
              in_step7: editC2.c2_10,
              in_step8: editC2.c2_11
            }
            : row
        )
      );
      setEditC2({ c2_id: '', c2_1: '', c2_2: '', c2_3: '', c2_4: '', c2_5: '', c2_6: '', c2_7: '', c2_8: '', c2_9: '', c2_10: '', c2_11: '' });
      setEditRow2(null);
    } catch (err) {
      console.error('수정 실패');
    }
  };

  //3번 테이블 수정/삭제
  const [editRow3, setEditRow3] = useState(null);
  const [editC3, setEditC3] = useState({
    c3_id: '', c3_1: '', c3_2: '', c3_3: '', c3_4: '', c3_5: '', c3_6: '', c3_7: ''
  });
  const handleC3Delete = async (cii_id) => {
    try {
      await deleteC3row(cii_id);
      setTable2((prev) => prev.filter((row) => row.cii_id !== cii_id));
    } catch (err) {
      console.error('삭제 실패');
    }
  }
  const c3EditSave = async () => {
    try {
      await editC3row({ ...editC3, c3_id: editRow3 });
      setTable2(prev =>
        prev.map(row =>
          row.cii_id === editRow3
            ? {
              ...row,
              ship_id: editC3.c3_1,
              start_date: editC3.c3_2,
              end_date: editC3.c3_3,
              fuel_type: editC3.c3_4,
              fuel_tons: editC3.c3_5,
              distance_nm: editC3.c3_6,
              capacity_ton: editC3.c3_7,
            }
            : row
        )
      );
      setEditC3({ c3_id: '', c3_1: '', c3_2: '', c3_3: '', c3_4: '', c3_5: '', c3_6: '', c3_7: '' });
      setEditRow3(null);
    } catch (err) {
      console.error('수정 실패');
    }
  };

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
            {table1.filter((v) => v.io_type === 'OUT').slice(0, 5).map((v) =>
              editRow === v.ci_id ? (
                <tr key={v.ci_id}>
                  <td><input type="text" value={editC1.c1_1} onChange={(e) => setEditC1({ ...editC1, c1_1: e.target.value })}></input></td>
                  <td><input type="date" value={editC1.c1_2} onChange={(e) => setEditC1({ ...editC1, c1_2: e.target.value })}></input></td>
                  <td><input type="date" value={editC1.c1_3} onChange={(e) => setEditC1({ ...editC1, c1_3: e.target.value })}></input></td>
                  <td><input type="text" value={editC1.c1_4} onChange={(e) => setEditC1({ ...editC1, c1_4: e.target.value })}></input></td>
                  <td><input type="text" value={editC1.c1_5} onChange={(e) => setEditC1({ ...editC1, c1_5: e.target.value })}></input></td>
                  <td><input type="text" value={editC1.c1_6} onChange={(e) => setEditC1({ ...editC1, c1_6: e.target.value })}></input></td>
                  <td><input type="text" value={editC1.c1_7} onChange={(e) => setEditC1({ ...editC1, c1_7: e.target.value })}></input></td>
                  <td><input type="text" value={editC1.c1_8} onChange={(e) => setEditC1({ ...editC1, c1_8: e.target.value })}></input></td>
                  <td><button className={styles["btn-save"]} onClick={c1EditSave}>저장</button></td>
                  <td><button className={styles["btn-cancel"]} onClick={() => setEditRow(null)}>취소</button></td>
                </tr>
              ) : (
                <tr key={v.ci_id}>
                  <td>{v.ship_id}</td>
                  <td>{v.start_date.split('T')[0]}</td>
                  <td>{v.end_date.split('T')[0]}</td>
                  <td>{v.out_step1}</td>
                  <td>{v.out_step2}</td>
                  <td>{v.out_step3}</td>
                  <td>{v.out_step4}</td>
                  <td>{v.out_step5}</td>
                  <td><button className={styles["btn-edit"]} onClick={() => {
                    setEditRow(v.ci_id);
                    setEditC1({
                      c1_id: v.ci_id,
                      c1_1: v.ship_id,
                      c1_2: v.start_date.split("T")[0],
                      c1_3: v.end_date.split("T")[0],
                      c1_4: v.out_step1,
                      c1_5: v.out_step2,
                      c1_6: v.out_step3,
                      c1_7: v.out_step4,
                      c1_8: v.out_step5,
                    });
                  }}>수정</button></td>
                  <td><button className={styles["btn-delete"]} onClick={() => handleC1Delete(v.ci_id)}>삭제</button></td>
                </tr>
              )
            )}
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
            {table1.filter((v) => v.io_type === 'IN').slice(0, 5).map((v) =>
              editRow2 === v.ci_id ? (
                <tr key={v.ci_id}>
                  <td><input type="text" value={editC2.c2_1} onChange={(e) => setEditC2({ ...editC2, c2_1: e.target.value })}></input></td>
                  <td><input type="date" value={editC2.c2_2} onChange={(e) => setEditC2({ ...editC2, c2_2: e.target.value })}></input></td>
                  <td><input type="date" value={editC2.c2_3} onChange={(e) => setEditC2({ ...editC2, c2_3: e.target.value })}></input></td>
                  <td><input type="text" value={editC2.c2_4} onChange={(e) => setEditC2({ ...editC2, c2_4: e.target.value })}></input></td>
                  <td><input type="text" value={editC2.c2_5} onChange={(e) => setEditC2({ ...editC2, c2_5: e.target.value })}></input></td>
                  <td><input type="text" value={editC2.c2_6} onChange={(e) => setEditC2({ ...editC2, c2_6: e.target.value })}></input></td>
                  <td><input type="text" value={editC2.c2_7} onChange={(e) => setEditC2({ ...editC2, c2_7: e.target.value })}></input></td>
                  <td><input type="text" value={editC2.c2_8} onChange={(e) => setEditC2({ ...editC2, c2_8: e.target.value })}></input></td>
                  <td><input type="text" value={editC2.c2_9} onChange={(e) => setEditC2({ ...editC2, c2_9: e.target.value })}></input></td>
                  <td><input type="text" value={editC2.c2_10} onChange={(e) => setEditC2({ ...editC2, c2_10: e.target.value })}></input></td>
                  <td><input type="text" value={editC2.c2_11} onChange={(e) => setEditC2({ ...editC2, c2_11: e.target.value })}></input></td>
                  <td><button className={styles["btn-save"]} onClick={c2EditSave}>저장</button></td>
                  <td><button className={styles["btn-cancel"]} onClick={() => setEditRow2(null)}>취소</button></td>
                </tr>
              ) : (
                <tr key={v.ci_id}>
                  <td>{v.ship_id}</td>
                  <td>{v.start_date.split('T')[0]}</td>
                  <td>{v.end_date.split('T')[0]}</td>
                  <td>{v.in_step1}</td>
                  <td>{v.in_step2}</td>
                  <td>{v.in_step3}</td>
                  <td>{v.in_step4}</td>
                  <td>{v.in_step5}</td>
                  <td>{v.in_step6}</td>
                  <td>{v.in_step7}</td>
                  <td>{v.in_step8}</td>
                  <td><button className={styles["btn-edit"]} onClick={() => {
                    setEditRow2(v.ci_id);
                    setEditC2({
                      c2_id: v.ci_id,
                      c2_1: v.ship_id,
                      c2_2: v.start_date.split("T")[0],
                      c2_3: v.end_date.split("T")[0],
                      c2_4: v.in_step1,
                      c2_5: v.in_step2,
                      c2_6: v.in_step3,
                      c2_7: v.in_step4,
                      c2_8: v.in_step5,
                      c2_9: v.in_step6,
                      c2_10: v.in_step7,
                      c2_11: v.in_step8,
                    });
                  }}>수정</button></td>
                  <td><button className={styles["btn-delete"]} onClick={() => handleC1Delete(v.ci_id)}>삭제</button></td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* 운항 중 탄소 배출량 */}
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
            {table2.slice(0, 5).map((v) =>
              editRow3 === v.cii_id ? (
                <tr key={v.cii_id}>
                  <td><input type="text" value={editC3.c3_1} onChange={(e) => setEditC3({ ...editC3, c3_1: e.target.value })}></input></td>
                  <td><input type="date" value={editC3.c3_2} onChange={(e) => setEditC3({ ...editC3, c3_2: e.target.value })}></input></td>
                  <td><input type="date" value={editC3.c3_3} onChange={(e) => setEditC3({ ...editC3, c3_3: e.target.value })}></input></td>
                  <td><input type="text" value={editC3.c3_4} onChange={(e) => setEditC3({ ...editC3, c3_4: e.target.value })}></input></td>
                  <td><input type="text" value={editC3.c3_5} onChange={(e) => setEditC3({ ...editC3, c3_5: e.target.value })}></input></td>
                  <td><input type="text" value={editC3.c3_6} onChange={(e) => setEditC3({ ...editC3, c3_6: e.target.value })}></input></td>
                  <td><input type="text" value={editC3.c3_7} onChange={(e) => setEditC3({ ...editC3, c3_7: e.target.value })}></input></td>
                  <td><button className={styles["btn-save"]} onClick={c3EditSave}>저장</button></td>
                  <td><button className={styles["btn-cancel"]} onClick={() => setEditRow3(null)}>취소</button></td>
                </tr>
              ) : (
                <tr key={v.cii_id}>
                  <td>{v.ship_id}</td>
                  <td>{v.start_date.split('T')[0]}</td>
                  <td>{v.end_date.split('T')[0]}</td>
                  <td>{v.fuel_type}</td>
                  <td>{v.fuel_tons}</td>
                  <td>{v.distance_nm}</td>
                  <td>{v.capacity_ton}</td>
                  <td><button className={styles["btn-edit"]} onClick={() => {
                    setEditRow3(v.cii_id);
                    setEditC3({
                      c3_id: v.cii_id,
                      c3_1: v.ship_id,
                      c3_2: v.start_date.split("T")[0],
                      c3_3: v.end_date.split("T")[0],
                      c3_4: v.fuel_type,
                      c3_5: v.fuel_tons,
                      c3_6: v.distance_nm,
                      c3_7: v.capacity_ton,
                    });
                  }}>수정</button></td>
                  <td><button className={styles["btn-delete"]} onClick={() => handleC3Delete(v.cii_id)}>삭제</button></td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Carb3;
