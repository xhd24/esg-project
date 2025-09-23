import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./css/Login.css";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/login", formData);
      if (res.data.success) {
        alert("로그인 성공! 환영합니다 " + res.data.user.full_name);
      } else {
        alert("아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      alert("로그인 실패: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div>
          <label>아이디</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="아이디 입력"
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="비밀번호 입력"
          />
        </div>
        <button type="submit">로그인</button>
      </form>
      <div className="login-links">
        <Link to="/signup">회원가입</Link>
        <span> | </span>
        <Link to="/find-id">아이디 찾기</Link>
        <span> | </span>
        <Link to="/find-password">비밀번호 찾기</Link>
      </div>
    </div>
  );
}

export default Login;
