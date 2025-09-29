// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login } from "../api.js";
import "./css/Login.css";

function Login() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  // 커스텀 알림창 (공통 스타일과 맞춤)
  const [modal, setModal] = useState({
    open: false,
    title: "알림",
    message: "",
    isError: false,
    onConfirm: null,
  });

  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 성공 시 돌아갈 곳
  const getRedirectTarget = () => {
    // 우선순위: location.state.from -> 세션 저장된 경로 -> 홈
    const stateFrom = location.state?.from;
    const stored = sessionStorage.getItem("postLoginRedirect");
    return stateFrom || stored || "/";
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await login(id, pw);

    if (res.success) {
      // 세션 저장
      sessionStorage.setItem("userId", res.userId);
      sessionStorage.setItem("userKey", res.userKey);
      sessionStorage.setItem("isLogin", "true");
      window.dispatchEvent(new Event("storage"));

      const to = getRedirectTarget();

      // 성공 모달: 확인 누르면 목적지로 이동
      setModal({
        open: true,
        title: "알림",
        message: "로그인 성공! 이동합니다.",
        isError: false,
        onConfirm: () => {
          setModal((m) => ({ ...m, open: false }));
          // 사용된 redirect 정보는 정리
          sessionStorage.removeItem("postLoginRedirect");
          navigate(to, { replace: true });
        },
      });
    } else {
      setModal({
        open: true,
        title: "알림",
        message: res.error || "로그인에 실패했습니다.",
        isError: true,
        onConfirm: () => setModal((m) => ({ ...m, open: false })),
      });
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

      {/* ✅ 커스텀 알림창 (기존 전역 CSS 재사용) */}
      {modal.open && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3 className="modal-title">{modal.title}</h3>
            <p
              className="modal-message"
              style={{ color: modal.isError ? "#d93025" : "#188038", fontWeight: 600 }}
            >
              {modal.message}
            </p>
            <div className="modal-actions">
              <button
                className="alert-btn alert-btn--primary"
                onClick={modal.onConfirm || (() => setModal((m) => ({ ...m, open: false })))}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
