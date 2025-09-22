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

function App() {
    return (
        <>
            <BrowserRouter>
                <div className="main_nav">
                    <ul className="nav justify-content-end">
                        <li className="nav-item">
                            <Link to='/' className="nav-link active" aria-current="page">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/carbon' className="nav-link">탄소배출량(가제)</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/assessment' className="nav-link">ESG 평가 (가제)</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/faq' className="nav-link">FAQ</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/signup' className="nav-link">회원가입</Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/login' className="nav-link">로그인</Link>
                        </li>
                    </ul>
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
                </div>
                <Sidebar width={320}> </Sidebar>
            </BrowserRouter>

        </>
    );
}

export default App;