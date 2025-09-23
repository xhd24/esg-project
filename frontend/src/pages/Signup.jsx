import { useState } from "react";
import axios from "axios";
import "./css/Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    emailLocal: "",
    emailDomain: "naver.com",
    customDomain: "",
    name: "",
    password: "",
    confirmPassword: "",
    company: "",
    category: "",
    gender: "",
    position: "",
    department: "",
  });

  const fullEmail =
    formData.emailDomain === "custom"
      ? `${formData.emailLocal}@${formData.customDomain}`
      : `${formData.emailLocal}@${formData.emailDomain}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 입력 누락 체크
    if (!formData.name) return alert("성명을 입력해주세요.");
    if (!formData.username) return alert("아이디를 입력해주세요.");
    if (!formData.emailLocal) return alert("이메일 아이디를 입력해주세요.");
    if (formData.emailDomain === "custom" && !formData.customDomain)
      return alert("이메일 도메인을 입력해주세요.");
    if (!formData.password) return alert("비밀번호를 입력해주세요.");
    if (formData.password.length < 8)
      return alert("비밀번호는 8자 이상이어야 합니다.");
    if (!formData.confirmPassword)
      return alert("비밀번호 확인을 입력해주세요.");
    if (formData.password !== formData.confirmPassword)
      return alert("비밀번호가 일치하지 않습니다.");
    if (!formData.company) return alert("기업명을 입력해주세요.");
    if (!formData.category) return alert("카테고리를 선택해주세요.");
    if (!formData.position) return alert("직급을 선택해주세요.");
    if (!formData.department) return alert("부서를 선택해주세요.");
    if (!formData.gender) return alert("성별을 선택해주세요.");

    try {
      const res = await axios.post("http://localhost:5000/api/signup", {
        ...formData,
        email: fullEmail,
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
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* 이메일 */}
          <div>
            <label>이메일</label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="text"
                name="emailLocal"
                value={formData.emailLocal}
                onChange={handleChange}
                style={{ flex: "1" }}
              />
              <span>@</span>
              <select
                name="emailDomain"
                value={formData.emailDomain}
                onChange={handleChange}
                style={{ flex: "1" }}
              >
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="custom">직접 입력</option>
              </select>
              {formData.emailDomain === "custom" && (
                <input
                  type="text"
                  name="customDomain"
                  placeholder="직접 입력"
                  value={formData.customDomain}
                  onChange={handleChange}
                  style={{ flex: "1" }}
                />
              )}
            </div>
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

          {/* 기업명 */}
          <div>
            <label>기업명</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label>카테고리</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="category"
                  value="조선"
                  checked={formData.category === "조선"}
                  onChange={handleChange}
                />{" "}
                조선
              </label>
              <label>
                <input
                  type="radio"
                  name="category"
                  value="자동차"
                  checked={formData.category === "자동차"}
                  onChange={handleChange}
                />{" "}
                자동차
              </label>
            </div>
          </div>

          {/* 직급 */}
          <div>
            <label>직급</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="position"
                  value="사원"
                  checked={formData.position === "사원"}
                  onChange={handleChange}
                />{" "}
                사원
              </label>
              <label>
                <input
                  type="radio"
                  name="position"
                  value="대리"
                  checked={formData.position === "대리"}
                  onChange={handleChange}
                />{" "}
                대리
              </label>
              <label>
                <input
                  type="radio"
                  name="position"
                  value="과장"
                  checked={formData.position === "과장"}
                  onChange={handleChange}
                />{" "}
                과장
              </label>
            </div>
          </div>

          {/* 부서 */}
          <div>
            <label>부서</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="department"
                  value="ESG전략팀"
                  checked={formData.department === "ESG전략팀"}
                  onChange={handleChange}
                />{" "}
                ESG전략팀
              </label>
              <label>
                <input
                  type="radio"
                  name="department"
                  value="환경/에너지 팀"
                  checked={formData.department === "환경/에너지 팀"}
                  onChange={handleChange}
                />{" "}
                환경/에너지 팀
              </label>
              <label>
                <input
                  type="radio"
                  name="department"
                  value="IR/공시팀"
                  checked={formData.department === "IR/공시팀"}
                  onChange={handleChange}
                />{" "}
                IR/공시팀
              </label>
            </div>
          </div>

          {/* 성별 */}
          <div>
            <label>성별</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="남"
                  checked={formData.gender === "남"}
                  onChange={handleChange}
                />{" "}
                남
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="여"
                  checked={formData.gender === "여"}
                  onChange={handleChange}
                />{" "}
                여
              </label>
            </div>
          </div>

          <button type="submit">회원가입</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
