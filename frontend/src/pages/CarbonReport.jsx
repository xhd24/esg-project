import { useState } from 'react';
import C1Result from './C1_result.jsx';
import C2Result from './C2_result.jsx';
import "./css/C1Result.css";

export default function CarbonReport() {

  const [isC3, setisC3] = useState(false);

  return (
    <div className='c1r-wrap' >
      <div className="c1r-tabs">
        <button onClick={() => setisC3(false)} className={isC3 == false ? "active" : ""}>조선소 내/외부 탄소 배출량</button>
        <button onClick={() => setisC3(true)} className={isC3 == true ? "active" : ""}>운항 탄소 배출량</button>
      </div>
      {isC3 ?
        <C2Result></C2Result> : <C1Result></C1Result>}
    </div>

  );
}
