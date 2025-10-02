// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
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
    role: "USER",
  });

  // 필드별 에러 메시지
  const [errors, setErrors] = useState({});
  // 커스텀 알림창
  const [modal, setModal] = useState({ open: false, message: "", isError: false });

  const navigate = useNavigate();
  const location = useLocation();
  // ★ 로그인에서 넘겨준 최종 목적지(없으면 홈)
  const from = location.state?.from || "/";

  // 단일 필드 검증
  const validateField = (name, value, all = formData) => {
    switch (name) {
      case "name":
        if (!value) return "성명을 입력해주세요.";
        break;
      case "login_id":
        if (!value) return "아이디를 입력해주세요.";
        break;
      case "email": {
        if (!value) return "이메일을 입력해주세요.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "유효한 이메일 주소를 입력해주세요.";
        break;
      }
      case "password":
        if (!value) return "비밀번호를 입력해주세요.";
        if (value.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
        break;
      case "confirmPassword":
        if (!value) return "비밀번호 확인을 입력해주세요.";
        if (value !== all.password) return "비밀번호가 일치하지 않습니다.";
        break;
      case "company":
        if (!value) return "회사를 선택해주세요.";
        break;
      case "position":
        if (!value) return "직급을 선택해주세요.";
        break;
      case "department":
        if (!value) return "부서를 선택해주세요.";
        break;
      case "gender":
        if (!value) return "성별을 선택해주세요.";
        break;
      default:
        break;
    }
    return "";
  };

  // 전체 검증
  const validateAll = (data) => {
    const nextErrors = {};
    Object.keys(data).forEach((key) => {
      const msg = validateField(key, data[key], data);
      if (msg) nextErrors[key] = msg;
    });
    return nextErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);

    // 입력 즉시 해당 필드만 재검증
    const msg = validateField(name, value, next);
    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 전필드 검증
    const nextErrors = validateAll(formData);
    setErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(Boolean);
    if (hasError) {
      const firstErr = Object.values(nextErrors).find(Boolean);
      setModal({ open: true, message: firstErr || "입력값을 확인해주세요.", isError: true });
      return;
    }

    // 전송 전 간단한 정리(공백 제거)
    const payload = {
      ...formData,
      login_id: formData.login_id.trim(),
      name: formData.name.trim(),
      email: formData.email.trim(),
    };

    try {
      await axios.post("https://trueesg.duckdns.org/signup", payload, {
        headers: { "Content-Type": "application/json" },
      });

      // 성공 모달 → 로그인 페이지로 이동 (원래 가려던 경로 함께 전달)
      setModal({ open: true, message: "회원가입 완료! 로그인 페이지로 이동합니다.", isError: false });
      setTimeout(() => navigate("/login", { replace: true, state: { from } }), 1200);
    } catch (err) {
      // 서버 에러 메시지가 있으면 노출
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "회원가입 실패. 다시 시도해주세요.";
      setModal({ open: true, message: msg, isError: true });
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2>회원가입</h2>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          {/* 성명 */}
          <div className="field">
            <label>성명</label>
            <input
              type="text"
              name="name"
              className={`input ${errors.name ? "input-error" : ""}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="성명 입력"
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          {/* 아이디 */}
          <div className="field">
            <label>아이디</label>
            <input
              type="text"
              name="login_id"
              className={`input ${errors.login_id ? "input-error" : ""}`}
              value={formData.login_id}
              onChange={handleChange}
              placeholder="아이디 입력"
            />
            {errors.login_id && <p className="field-error">{errors.login_id}</p>}
          </div>

          {/* 이메일 */}
          <div className="field">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              className={`input ${errors.email ? "input-error" : ""}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="example@example.com"
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          {/* 비밀번호 */}
          <div className="field">
            <label>비밀번호 (8자 이상)</label>
            <input
              type="password"
              name="password"
              className={`input ${errors.password ? "input-error" : ""}`}
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호 입력"
              minLength={8}
            />
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div className="field">
            <label>비밀번호 확인</label>
            <input
              type="password"
              name="confirmPassword"
              className={`input ${errors.confirmPassword ? "input-error" : ""}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호 재입력"
              minLength={8}
            />
            {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
          </div>

          {/* 회사 */}
          <div className="field">
            <label>회사명</label>
            <select
              name="company"
              className={`input ${errors.company ? "input-error" : ""}`}
              value={formData.company}
              onChange={handleChange}
            >
              <option value="">선택하세요</option>
              <option value="삼성중공업">삼성중공업</option>
              <option value="한화오션">한화오션</option>
              <option value="현대중공업">현대중공업</option>
            </select>
            {errors.company && <p className="field-error">{errors.company}</p>}
          </div>

          {/* 직급 */}
          <div className="field">
            <label>직급</label>
            <select
              name="position"
              className={`input ${errors.position ? "input-error" : ""}`}
              value={formData.position}
              onChange={handleChange}
            >
              <option value="">선택하세요</option>
              <option value="사원">사원</option>
              <option value="대리">대리</option>
              <option value="과장">과장</option>
            </select>
            {errors.position && <p className="field-error">{errors.position}</p>}
          </div>

          {/* 부서 */}
          <div className="field">
            <label>부서</label>
            <select
              name="department"
              className={`input ${errors.department ? "input-error" : ""}`}
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">선택하세요</option>
              <option value="ESG전략팀">ESG전략팀</option>
              <option value="환경/에너지팀">환경/에너지팀</option>
              <option value="IR/공시팀">IR/공시팀</option>
            </select>
            {errors.department && <p className="field-error">{errors.department}</p>}
          </div>

        {/* 성별 */}
<div className="field">
  <label>성별</label>

  {/* 세그먼트 토글 */}
  <div className={`segmented ${errors.gender ? "segmented-error" : ""}`}>
    {/* 남성 */}
    <input
      id="gender-m"
      className="segmented-input"
      type="radio"
      name="gender"
      value="MALE"
      checked={formData.gender === "MALE"}
      onChange={handleChange}
    />
    <label
      htmlFor="gender-m"
      className={`segmented-label ${formData.gender === "MALE" ? "active" : ""}`}
    >
      남
    </label>

    {/* 여성 */}
    <input
      id="gender-f"
      className="segmented-input"
      type="radio"
      name="gender"
      value="FEMALE"
      checked={formData.gender === "FEMALE"}
      onChange={handleChange}
    />
    <label
      htmlFor="gender-f"
      className={`segmented-label ${formData.gender === "FEMALE" ? "active" : ""}`}
    >
      여
    </label>

    {/* 움직이는 배경(엄지) */}
    <span
      className={`segmented-thumb ${
        formData.gender === "FEMALE" ? "right" : ""
      }`}
      aria-hidden="true"
    />
  </div>

  {errors.gender && <p className="field-error">{errors.gender}</p>}
</div>


          {/* 기본 권한 */}
          <input type="hidden" name="role" value={formData.role} />

          <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>
            회원가입
          </button>
        </form>
      </div>

      {/* 공통 커스텀 알림창 */}
      {modal.open && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3 className="modal-title">알림</h3>
            <p
              className="modal-message"
              style={{ color: modal.isError ? "#d93025" : "#188038", fontWeight: 600 }}
            >
              {modal.message}
            </p>
            <div className="modal-actions">
              <button
                className="alert-btn alert-btn--primary"
                onClick={() => setModal((m) => ({ ...m, open: false }))}
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

export default Signup;
