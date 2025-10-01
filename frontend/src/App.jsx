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
  const [showLogoutAlert, setShowLogoutAlert] = useState(false); // 로그아웃 모달
  const sidebarWidth = 280;

  // ✅ 공통 모달 (Carb2 등에서 호출 가능)
  const [globalModal, setGlobalModal] = useState({
    show: false,
    message: "",
    onConfirm: null,
  });

  const closeModal = () =>
    setGlobalModal({ show: false, message: "", onConfirm: null });

  // 실제 로그아웃 실행 + 홈으로 이동
  const doLogout = () => {
    sessionStorage.clear();
    setIsLogin(false);
    setUserId("");
    window.dispatchEvent(new Event("storage")); // 다른 탭 동기화
    setShowLogoutAlert(false);
    if (window.location.pathname !== "/") {
      window.location.replace("/");
    }
  };

  // 로그아웃 버튼 클릭 → 로그아웃 모달 표시
  const onClickLogout = () => setShowLogoutAlert(true);
  const closeLogoutAlert = () => setShowLogoutAlert(false);

  // ✅ 공통 모달 이벤트 수신 (Carb2 등에서 사용)
  useEffect(() => {
    const handleOpenModal = (e) => {
      const { message } = e.detail;
      setGlobalModal({ show: true, message });
    };
    window.addEventListener("openGlobalModal", handleOpenModal);
    return () =>
      window.removeEventListener("openGlobalModal", handleOpenModal);
  }, []);

  // 로그인 상태 초기화
  useEffect(() => {
    const storedLogin = sessionStorage.getItem("isLogin") === "true";
    const storedUserId = sessionStorage.getItem("userId");
    setIsLogin(storedLogin);
    setUserId(storedUserId || "");
  }, []);

  // 다른 탭과 로그인 상태 동기화
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
            <div className="nav-inner">

              <a href="/">
                <img src={logo} className="logo" alt="logo" />
              </a>
              <div className="nav-right">
                <ul className="nav">
                  <li className="nav-item">
                    <Link to="/" className="nav-link">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/carbon" className="nav-link">
                      탄소배출량
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/assessment" className="nav-link">
                      ESG 평가
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/faq" className="nav-link">
                      FAQ
                    </Link>
                  </li>
                  {isLogin ? (
                    <li className="nav-item user-info">
                      <span className="user-greet">
                        <span className="user-dot" aria-hidden="true"></span>
                        {`${userId}님 안녕하세요!`}
                      </span>
                      <button className="logout-btn logout-pill" onClick={onClickLogout}>로그아웃</button>
                    </li>



                  ) : (
                    <li className="nav-item">
                      <Link to="/login" className="nav-link login">
                        <span className="green">로그인</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
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
              <Route path="/report" element={<ReportBack />} />
              <Route path="/report/:year" element={<CarbonReport />} />
              <Route path="/report/:year" element={<ReportYear />} />

              {/* ESG Reports 리스트 */}
              <Route path="/ESG_reports" element={<ESG_Reports />} />

              {/* ESG Report (연도별 제출 이력) */}
              <Route path="/ESG_report/:year" element={<ESG_Report />} />

              {/* ✅ ESG Report 상세 (제출 선택 시 이동) */}
              <Route
                path="/ESG_report/:year/submission/:sid"
                element={<ESG_ReportDetail />}
              />

              {/* 기타 */}
              <Route path="/faq_res" element={<FAQRes />} />
              <Route path="/faq_res/:id" element={<FAQDetail />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>

      {/* ✅ 로그아웃 알림 모달 */}
      {showLogoutAlert && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3 className="modal-title">알림</h3>
            <p className="modal-message">
              로그아웃하시겠습니까? 확인을 누르면 홈으로 이동합니다.
            </p>
            <div className="modal-actions">
              <button
                className="alert-btn alert-btn--ghost"
                onClick={closeLogoutAlert}
              >
                취소
              </button>
              <button
                className="alert-btn alert-btn--primary"
                onClick={doLogout}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ 공통 모달 (Carb2 등에서 사용) */}
      {globalModal.show && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3 className="modal-title">알림</h3>
            <p className="modal-message">{globalModal.message}</p>
            <div className="modal-actions">
              <button
                className="alert-btn alert-btn--primary"
                onClick={() => {
                  if (globalModal.onConfirm) globalModal.onConfirm();
                  closeModal();
                }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
