// src/App.jsx
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
import ESG_Reports from "./pages/ESG_Reports.jsx";
import ESG_Report_2025 from "./pages/ESG_Report_2025.jsx";
import ESG_Report_2024 from "./pages/ESG_Report_2024.jsx";
import ESG_Report_2023 from "./pages/ESG_Report_2023.jsx";
import logo from "./assets/images/logo.png";
import { useEffect, useState } from "react";
import { FAQWrite, FAQHistory } from "./pages/Query.jsx";
import Carb1 from "./pages/Carb1.jsx";
import Carb2 from "./pages/Carb2.jsx";
import Carb3 from "./pages/Carb3.jsx";
import FAQRes from "./pages/FAQRes.jsx";
import FAQDetail from "./pages/FAQDetail.jsx";
import Footer from "./pages/Footer.jsx";

// 결과 화면
import CarbonReport from "./pages/CarbonReport.jsx";

// 탄소배출 안내
import ESGBack from "./pages/esg_back.jsx";

// Report 랜딩/연도별
import ReportBack from "./pages/report._back.jsx";
import ReportYear from "./pages/report.year.jsx";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userId, setUserId] = useState("");
  const sidebarWidth = 280;

  const logout = () => {
    sessionStorage.clear();
    setIsLogin(false);
    setUserId("");
  };

  useEffect(() => {
    const storedLogin = sessionStorage.getItem("isLogin") === "true";
    const storedUserId = sessionStorage.getItem("userId");
    setIsLogin(storedLogin);
    setUserId(storedUserId || "");
  }, []);

  useEffect(() => {
    const syncLoginState = () => {
      setIsLogin(sessionStorage.getItem("isLogin") === "true");
      setUserId(sessionStorage.getItem("userId") || "");
    };
    window.addEventListener("storage", syncLoginState);
    return () => window.removeEventListener("storage", syncLoginState);
  }, []);

  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar
          width={sidebarWidth}
          isOpen={isSidebarOpen}
          setOpen={setSidebarOpen}
        />

        <div
          style={{
            flex: 1,
            marginLeft: isSidebarOpen ? `${sidebarWidth}px` : "0",
            transition: "margin-left 0.3s ease",
          }}
        >
          <nav className="main_nav">
            <a href="/">
              <img src={logo} className="logo" alt="logo" />
            </a>
            <ul className="nav">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/carbon" className="nav-link">
                  탄소배출량(거제)
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/assessment" className="nav-link">
                  ESG 평가 (거제)
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/faq" className="nav-link">
                  FAQ
                </Link>
              </li>
              {isLogin ? (
                <li className="nav-item user-info">
                  <span>{userId}님 안녕하세요!</span>
                  <button className="logout-btn" onClick={logout}>
                    로그아웃
                  </button>
                </li>
              ) : (
                <li className="nav-item">
                  <Link to="/login" className="nav-link login">
                    <span className="green">로그인</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <main style={{ padding: "20px" }}>
            <Routes>
              {/* 기본 */}
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/find-id" element={<FindId />} />
              <Route path="/find-password" element={<FindPassword />} />

              {/* 탄소배출 섹션 */}
              <Route path="/carbon" element={<ESGBack />} />
              <Route path="/carbon/forms" element={<Carbon />}>
                <Route index element={<Carb1 />} />
                <Route path="c2" element={<Carb2 />} />
                <Route path="c3" element={<Carb3 />} />
              </Route>

              <Route path="/assessment" element={<Assessment />} />

              {/* FAQ */}
              <Route path="/faq" element={<FAQ />}>
                <Route index element={<FAQHistory />} />
                <Route path="write" element={<FAQWrite />} />
              </Route>

              {/* Report */}
              {/* /report : 랜딩(이미지 카드) */}
              <Route path="/report" element={<ReportBack />} />

              {/* 연도별 → 결과 화면 매핑 */}
              <Route path="/report/:year" element={<CarbonReport />} />

              {/* 그 외 연도는 공통 페이지에서 처리 (옵션) */}
              <Route path="/report/:year" element={<ReportYear />} />

              {/* 기존 리포트 목록/상세 (필요시 유지) */}
              <Route path="/ESG_reports" element={<ESG_Reports />} />
              <Route path="/ESG_report_2025" element={<ESG_Report_2025 />} />
              <Route path="/ESG_report_2024" element={<ESG_Report_2024 />} />
              <Route path="/ESG_report_2023" element={<ESG_Report_2023 />} />

              {/* FAQ 답변 */}
              <Route path="/faq_res" element={<FAQRes />} />
              <Route path="/faq_res/:id" element={<FAQDetail />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
