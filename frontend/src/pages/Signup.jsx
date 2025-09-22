import { useState } from "react";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",        // 성명
    position: "",    // 직급
    department: "",  // 부서
    company: "",
    category: "",    // 카테고리 (조선/자동차)
    gender: "",      // 성별
  });

  // input, radio, select 값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    console.log("회원가입 데이터:", formData);
    alert("회원가입 완료 (예시)");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        {/* 아이디 */}

        {/* 성명 */}
        <div>
          <label>성명</label>
          <br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>아이디</label>
          <br />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* 이메일 */}
        <div>
          <label>이메일</label>
          <br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* 비밀번호 */}
        <div>
          <label>비밀번호</label>
          <br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label>비밀번호 확인</label>
          <br />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* 기업명 */}
        <div>
          <label>기업명</label>
          <br />
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        {/* 직급 (라디오 버튼) */}
        <div>
          <label>직급</label>
          <br />
          <label>
            <input
              type="radio"
              name="position"
              value="사원"
              checked={formData.position === "사원"}
              onChange={handleChange}
            />
            사원
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="position"
              value="대리"
              checked={formData.position === "대리"}
              onChange={handleChange}
            />
            대리
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="position"
              value="과장"
              checked={formData.position === "과장"}
              onChange={handleChange}
            />
            과장
          </label>
        </div>

        {/* 부서 (라디오 버튼) */}
        <div>
          <label>부서</label>
          <br />
          <label>
            <input
              type="radio"
              name="department"
              value="esg전략팀"
              checked={formData.department === "esg전략팀"}
              onChange={handleChange}
            />
            ESG전략팀
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="department"
              value="환경/에너지팀"
              checked={formData.department === "환경/에너지팀"}
              onChange={handleChange}
            />
            환경/에너지팀
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="department"
              value="IR/공시"
              checked={formData.department === "IR/공시"}
              onChange={handleChange}
            />
            IR/공시
          </label>
        </div>

        {/* 카테고리 (라디오 버튼) */}
        <div>
          <label>카테고리</label>
          <br />
          <label>
            <input
              type="radio"
              name="category"
              value="조선"
              checked={formData.category === "조선"}
              onChange={handleChange}
            />
            조선
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="category"
              value="자동차"
              checked={formData.category === "자동차"}
              onChange={handleChange}
            />
            자동차
          </label>
        </div>

        {/* 성별 (라디오 버튼) */}
        <div>
          <label>성별</label>
          <br />
          <label>
            <input
              type="radio"
              name="gender"
              value="남"
              checked={formData.gender === "남"}
              onChange={handleChange}
            />
            남
          </label>
          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              name="gender"
              value="여"
              checked={formData.gender === "여"}
              onChange={handleChange}
            />
            여
          </label>
        </div>

        <button type="submit" style={{ marginTop: "1rem" }}>
          회원가입
        </button>
      </form>
    </div>
  );
}

export default Signup;
