// App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Assessment from './pages/Assessment.jsx';
import Carbon from './pages/Carbon.jsx';
import Signup from './pages/Signup.jsx';
import FAQ from './pages/FAQ.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "./pages/Sidebar.jsx";
import Report from "./pages/Report.jsx";
import History from "./pages/History.jsx";
import logo from './assets/images/logo.png';
import { useState } from "react";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarWidth = 320;

  return (
    <BrowserRouter>
      {/* 전체 레이아웃 */}
      <div style={{ display: "flex" }}>
        
        {/* 사이드바 */}
        <Sidebar width={sidebarWidth} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />

        {/* 메인 영역 */}
        <div
          style={{
            flex: 1,
            marginLeft: isSidebarOpen ? `${sidebarWidth}px` : "0",
            transition: "margin-left 0.3s ease"
          }}
        >
          {/* 네비게이션 바 */}
          <nav className="main_nav">
            <img src={logo} className="logo" alt="logo" />
            <ul className="nav">
              <li className="nav-item"><Link to='/' className="nav-link">Home</Link></li>
              <li className="nav-item"><Link to='/carbon' className="nav-link">탄소배출량(가제)</Link></li>
              <li className="nav-item"><Link to='/assessment' className="nav-link">ESG 평가 (가제)</Link></li>
              <li className="nav-item"><Link to='/faq' className="nav-link">FAQ</Link></li>
              <li className="nav-item"><Link to='/login' className="nav-link login"><span className="green">로그인</span></Link></li>
            </ul>
          </nav>

          {/* 페이지 콘텐츠 */}
          <main style={{ padding: "20px" }}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/login' element={<Login />} />
              <Route path='/carbon' element={<Carbon />} />
              <Route path='/assessment' element={<Assessment />} />
              <Route path='/faq' element={<FAQ />} />
              <Route path='/report' element={<Report />} />
              <Route path='/history' element={<History />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
