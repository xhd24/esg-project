import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Assessment from './pages/Assessment.jsx';
import Carbon from './pages/Carbon.jsx';
import Signup from './pages/Signup.jsx';
import FAQ from './pages/FAQ.jsx';


function App() {
    return (
        <BrowserRouter>
            <div>
                <nav>
                    <Link to='/'>Home</Link>
                    <Link to='/Signup'>회원가입</Link>
                    <Link to='/login'>로그인</Link>
                    <Link to='/carbon'>탄소배출량(가제)</Link>
                    <Link to='/assessment'>ESG 평가 (가제)</Link>
                    <Link to='/faq'>FAQ</Link>
                </nav>
                <Routes>
                    <Route path='/' element={<Home />} />   
                    <Route path='/Signup' element={<Signup />} />   
                    <Route path='/login' element={<Login />} />   
                    <Route path='/carbon' element={<Carbon />} />   
                    <Route path='/assessment' element={<Assessment />} />          
                    <Route path='/faq' element={<FAQ />} />                              
                    </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;