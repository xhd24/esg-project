import { useState } from "react";
import axios from "axios";
import "./css/Auth.css";

function FindPassword() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://trueesg.duckdns.org/api/find-password", { username, email });
      if (res.data.success) {
        setMessage("임시 비밀번호가 이메일로 발송되었습니다.");
      } else {
        setMessage(res.data.error);
      }
    } catch (err) {
      setMessage("비밀번호 찾기 실패: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="auth-container">
      <h2>비밀번호 찾기</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>아이디</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>이메일</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type="submit">비밀번호 찾기</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default FindPassword;
