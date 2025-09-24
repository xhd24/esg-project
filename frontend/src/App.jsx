import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Assessment from "./pages/Assessment.jsx";
import Carbon from "./pages/Carbon.jsx";
import Signup from "./pages/Signup.jsx";
import FAQ from "./pages/FAQ.jsx";
import FindId from "./pages/FindId.jsx";
import FindPassword from "./pages/FindPassword.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./pages/Sidebar.jsx";
import Report from "./pages/Report.jsx";
import ESG_Reports from "./pages/ESG_Reports.jsx";
import ESG_Report from "./pages/ESG_Report.jsx";
import logo from './assets/images/logo.png';
import { useState } from "react";
import { FAQWrite, FAQHistory } from "./pages/Query.jsx";
import Carb1 from "./pages/Carb1.jsx";
import Carb2 from "./pages/Carb2.jsx";
import Carb3 from "./pages/Carb3.jsx";
import FAQRes from "./pages/FAQRes.jsx";
import FAQDetail from "./pages/FAQDetail.jsx";

// ★ Report 하위 페이지들 임포트
import C1Result from "./pages/C1.result.jsx";
import C2Result from "./pages/C2.result.jsx";
import C3Result from "./pages/C3.result.jsx";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarWidth = 280;

  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar width={sidebarWidth} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />

        <div
          style={{
            flex: 1,
            marginLeft: isSidebarOpen ? `${sidebarWidth}px` : "0",
            transition: "margin-left 0.3s ease",
          }}
        >
          <nav className="main_nav">
            <img src={logo} className="logo" alt="logo" />
            <ul className="nav">
              <li className="nav-item"><Link to='/' className="nav-link">Home</Link></li>
              <li className="nav-item"><Link to='/carbon' className="nav-link">탄소배출량(거제)</Link></li>
              <li className="nav-item"><Link to='/assessment' className="nav-link">ESG 평가 (거제)</Link></li>
              <li className="nav-item"><Link to='/faq' className="nav-link">FAQ</Link></li>
              <li className="nav-item"><Link to='/login' className="nav-link login"><span className="green">로그인</span></Link></li>
            </ul>
          </nav>

          <main style={{ padding: "20px" }}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/login' element={<Login />} />
              <Route path='/find-id' element={<FindId />} />
              <Route path='/find-password' element={<FindPassword />} />

              {/* Carbon 섹션 */}
              <Route path="/carbon" element={<Carbon />}>
                <Route index element={<Carb1 />} />
                <Route path="c2" element={<Carb2 />} />
                <Route path="c3" element={<Carb3 />} />
              </Route>

              <Route path="/assessment" element={<Assessment />} />

              {/* FAQ 섹션 */}
              <Route path="/faq" element={<FAQ />}>
                <Route index element={<FAQHistory />} />
                <Route path="write" element={<FAQWrite />} />
              </Route>

              {/* ★ Report 레이아웃 + 하위 라우트 */}
              <Route path="/report" element={<Report />}>
                <Route index element={<C1Result />} />
                <Route path="c1.result" element={<C1Result />} />
                <Route path="c2.result" element={<C2Result />} />
                <Route path="c3.result" element={<C3Result />} />
              </Route>
              <Route path='/report' element={<Report />} />
              <Route path='/ESG_reports' element={<ESG_Reports />} />  {/* 리스트 */}
              <Route path='/ESG_report' element={<ESG_Report />} />   {/* 상세 */}
              <Route path='/faq_res' element={<FAQRes />} />
              <Route path='/faq_res/:id' element={<FAQDetail />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
