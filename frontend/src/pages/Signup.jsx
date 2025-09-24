import { useState } from "react";
import axios from "axios";
import "./css/Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    login_id: "",
    name: "",
    email: "",         // ✅ 이메일 추가
    password: "",
    confirmPassword: "",
    company: "",
    gender: "",
    position: "",
    role: "USER",      // 기본 권한
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 입력값 검증
    if (!formData.name) return alert("성명을 입력해주세요.");
    if (!formData.login_id) return alert("아이디를 입력해주세요.");
    if (!formData.email) return alert("이메일을 입력해주세요.");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return alert("유효한 이메일 주소를 입력해주세요.");
    if (!formData.password) return alert("비밀번호를 입력해주세요.");
    if (formData.password.length < 8)
      return alert("비밀번호는 8자 이상이어야 합니다.");
    if (!formData.confirmPassword)
      return alert("비밀번호 확인을 입력해주세요.");
    if (formData.password !== formData.confirmPassword)
      return alert("비밀번호가 일치하지 않습니다.");
    if (!formData.company) return alert("회사를 선택해주세요.");
    if (!formData.position) return alert("직급을 선택해주세요.");
    if (!formData.gender) return alert("성별을 선택해주세요.");

    try {
      const res = await axios.post("http://localhost:5000/signup", {
        ...formData,
      });
      alert("회원가입 성공! userId=" + res.data.userId);
    } catch (err) {
      alert("회원가입 실패: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2>회원가입</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* 성명 */}
          <div>
            <label>성명</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* 아이디 */}
          <div>
            <label>아이디</label>
            <input
              type="text"
              name="login_id"
              value={formData.login_id}
              onChange={handleChange}
            />
          </div>

          {/* 이메일 */}
          <div>
            <label>이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@example.com"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label>비밀번호 (8자 이상)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
            />
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label>비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength={8}
            />
          </div>

          {/* 회사 선택 */}
          <div>
            <label>회사명</label>
            <select
              name="company"
              value={formData.company}
              onChange={handleChange}
            >
              <option value="">선택하세요</option>
              <option value="삼성중공업">삼성중공업</option>
              <option value="한화오션">한화오션</option>
              <option value="현대중공업">현대중공업</option>
            </select>
          </div>

          {/* 직급 선택 */}
          <div>
            <label>직급</label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
            >
              <option value="">선택하세요</option>
              <option value="사원">사원</option>
              <option value="대리">대리</option>
              <option value="과장">과장</option>
              <option value="차장">차장</option>
              <option value="부장">부장</option>
            </select>
          </div>

          {/* 성별 선택 */}
          <div>
            <label>성별</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="MALE"
                  checked={formData.gender === "MALE"}
                  onChange={handleChange}
                />{" "}
                남
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="FEMALE"
                  checked={formData.gender === "FEMALE"}
                  onChange={handleChange}
                />{" "}
                여
              </label>
            </div>
          </div>

          <input type="hidden" name="role" value={formData.role} />

          <button type="submit">회원가입</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
