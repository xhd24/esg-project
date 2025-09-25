import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import "./css/Signup.css";

function Signup() {
  const [formData, setFormData] = useState({
    login_id: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    gender: "",
    position: "",
    department: "",
    role: "USER", // 기본 권한
  });

  const [show, setShow] = useState(false);       // ✅ 모달 표시 여부
  const [message, setMessage] = useState("");    // ✅ 메시지
  const [isError, setIsError] = useState(false); // ✅ 에러 여부

  const navigate = useNavigate(); // ✅ 페이지 이동 훅

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 입력값 검증
    if (!formData.name) return showModal("성명을 입력해주세요.", true);
    if (!formData.login_id) return showModal("아이디를 입력해주세요.", true);
    if (!formData.email) return showModal("이메일을 입력해주세요.", true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      return showModal("유효한 이메일 주소를 입력해주세요.", true);
    if (!formData.password) return showModal("비밀번호를 입력해주세요.", true);
    if (formData.password.length < 8)
      return showModal("비밀번호는 8자 이상이어야 합니다.", true);
    if (!formData.confirmPassword)
      return showModal("비밀번호 확인을 입력해주세요.", true);
    if (formData.password !== formData.confirmPassword)
      return showModal("비밀번호가 일치하지 않습니다.", true);
    if (!formData.company) return showModal("회사를 선택해주세요.", true);
    if (!formData.position) return showModal("직급을 선택해주세요.", true);
    if (!formData.department) return showModal("부서를 선택해주세요.", true);
    if (!formData.gender) return showModal("성별을 선택해주세요.", true);

    try {
      await axios.post("http://localhost:3000/signup", {
        ...formData,
      });
      showModal("회원가입 완료! 로그인 페이지로 이동합니다.", false);

      // ✅ 1.5초 후 로그인 페이지로 이동
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      showModal("회원가입 실패. 다시 시도해주세요.", true);
    }
  };

  // ✅ 모달 메시지 표시 함수
  const showModal = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);
    setShow(true);
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

          {/* 회사 */}
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

          {/* 직급 */}
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
            </select>
          </div>

          {/* 부서 */}
          <div>
            <label>부서</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">선택하세요</option>
              <option value="ESG전략팀">ESG전략팀</option>
              <option value="환경/에너지팀">환경/에너지팀</option>
              <option value="IR/공시팀">IR/공시팀</option>
            </select>
          </div>

          {/* 성별 */}
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

          {/* 기본 권한 */}
          <input type="hidden" name="role" value={formData.role} />

          <button type="submit">회원가입</button>
        </form>
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

export default Signup;
