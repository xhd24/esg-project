const BASE = "http://localhost:3000";

// 인증 헤더 생성 함수
export function getAuthHeaders() {
  const userKey = sessionStorage.getItem("userKey"); // Login.jsx에서 저장
  return {
    "Content-Type": "application/json",
    ...(userKey ? { Authorization: `Bearer ${userKey}` } : {}),
  };
}


//FAQ 게시판 히스토리
export async function getQueryHx(userId) {
  const res = await fetch(`${BASE}/faq`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return res.json();
}

// 관리자 FAQ 게시판 히스토리
export async function getQueryHxAll() {
  const res = await fetch(`${BASE}/faq_res`);
  return res.json();
}

// 관리자 FAQ 게시판 디테일
export async function getQueryDetail(id) {
  const res = await fetch(`${BASE}/faq_res/${id}`);
  return res.json();
}

//FAQ 게시판 글작성
export async function writeQuery(inquiry_title, requester, company, email, category, content) {
  const res = await fetch(`${BASE}/faq/write`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      inquiry_title,
      requester,
      company,
      email,
      category,
      content,
    }),
  });
  return res.json();
}

export async function apiFetch(path, options = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    // 필요 시 여기서 전역 로그아웃/리다이렉트 처리 가능
    // window.location.href = "/login";
    throw new Error("UNAUTHORIZED");
  }

  // 서버가 JSON 반환한다고 가정
  return res.json();
}


//로그인
export async function login(id, pw) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, pw }),
  });
  return res.json();
}

// * ESG 설문 API
// *  - 서버 라우트 prefix: /esg
// *  - Authorization 자동 첨부
const ESG_PREFIX = "/esg";

// 질문 목록 (카테고리별)
export async function getEsgQuestions(category) {
  const q = encodeURIComponent(category || "");
  const data = await apiFetch(`${ESG_PREFIX}/questions?category=${q}`);
  return data.questions || [];
}

// 내 답변(카테고리별 map: { [question_id]: '예'|'아니오' })
export async function getMyEsgAnswers(category) {
  const q = encodeURIComponent(category || "");
  const data = await apiFetch(`${ESG_PREFIX}/answers/me?category=${q}`);
  return data.answers || {};
}

// 일괄 저장(업서트): answers = [{ question_id, selected_option }]
export async function saveEsgAnswersBulk(answers) {
  const payload = { answers: Array.isArray(answers) ? answers : [] };
  return apiFetch(`${ESG_PREFIX}/answers/bulk`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// 내 리포트(카테고리별 yes/no/total)
export async function getMyEsgReport() {
  const data = await apiFetch(`${ESG_PREFIX}/report/me`);
  return data.report || [];
}
