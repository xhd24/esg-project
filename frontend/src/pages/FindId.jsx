import { useState } from "react";
import axios from "axios";
import "./css/Auth.css";

function FindId() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [foundId, setFoundId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/find-id", { email, fullName });
      if (res.data.success) {
        setFoundId(res.data.login_id);
      } else {
        alert(res.data.error);
      }
    } catch (err) {
      alert("아이디 찾기 실패: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="auth-container">
      <h2>아이디 찾기</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이메일</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>성명</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <button type="submit">아이디 찾기</button>
      </form>
      {foundId && <p>회원님의 아이디는 <strong>{foundId}</strong> 입니다.</p>}
    </div>
  );
}

export default FindId;
