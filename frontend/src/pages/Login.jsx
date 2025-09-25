import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { login } from "../api.js";
import "./css/Login.css";

function Login() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);

  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(id, pw);

    if (res.success) {
      sessionStorage.setItem("userId", res.userId);
      sessionStorage.setItem("isLogin", "true");
      window.dispatchEvent(new Event("storage"));
      setIsError(false);
      setMessage("로그인 성공! 메인 페이지로 이동합니다.");
      setShow(true); // ✅ Modal 열기
      setTimeout(() => navigate("/"), 1500);
    } else {
      setIsError(true);
      setMessage(res.error || "로그인에 실패했습니다.");
      setShow(true); // ✅ Modal 열기
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div>
          <label>아이디</label>
          <input
            type="text"
            name="userId"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            placeholder="아이디 입력"
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
            placeholder="비밀번호 입력"
          />
        </div>
        <button type="submit">로그인</button>

      </form>
      <div className="login-links">
        <Link to="/signup">회원가입</Link>
      </div>

      {/* ✅ Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>알림</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: isError ? "red" : "green" }}>
          {message}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Login;
