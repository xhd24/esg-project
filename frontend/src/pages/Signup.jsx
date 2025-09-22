import { useState } from 'react';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    categories: [],
    gender: '',
  });

  // input, checkbox, radio 변경 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => {
        const newCategories = checked
          ? [...prev.categories, value]
          : prev.categories.filter((c) => c !== value);
        return { ...prev, categories: newCategories };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    console.log('회원가입 데이터:', formData);
    alert('회원가입 완료 (예시)');
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>아이디</label><br />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>이메일</label><br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>비밀번호</label><br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>비밀번호 확인</label><br />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* 기업명 입력 */}
        <div>
          <label>기업명</label><br />
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        {/* 카테고리 선택 (체크박스) */}
        <div>
          <label>카테고리</label><br />
          <label>
            <input
              type="radio"
              name="categories"
              value="조선"
              checked={formData.categories.includes('조선')}
              onChange={handleChange}
            />
            조선
          </label>
          <label style={{ marginLeft: '10px' }}>
            <input
              type="radio"
              name="categories"
              value="자동차"
              checked={formData.categories.includes('자동차')}
              onChange={handleChange}
            />
            자동차
          </label>
        </div>

        {/* 성별 선택 (라디오 버튼) */}
        <div>
          <label>성별</label><br />
          <label>
            <input
              type="radio"
              name="gender"
              value="남"
              checked={formData.gender === '남'}
              onChange={handleChange}
            />
            남
          </label>
          <label style={{ marginLeft: '10px' }}>
            <input
              type="radio"
              name="gender"
              value="여"
              checked={formData.gender === '여'}
              onChange={handleChange}
            />
            여
          </label>
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>
          회원가입
        </button>
      </form>
    </div>
  );
}

export default Signup;
