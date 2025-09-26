const BASE = "http://localhost:3000";

// 인증 헤더 생성 함수
export function getAuthHeaders() {
  const userKey =
    sessionStorage.getItem("userKey") || localStorage.getItem("userKey");
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
  const headers = { ...getAuthHeaders(), ...(options.headers || {}) };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
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


// ESG
const ESG_PREFIX = "/esg";

// 질문 목록 (백엔드가 questionsSource에서 내려줌)
export async function getEsgQuestions(category) {
  const q = encodeURIComponent(category || "");
  const data = await apiFetch(`${ESG_PREFIX}/questions?category=${q}`);
  return data.questions || [];
}

// 내 답변(map 형태)
export async function getMyEsgAnswers(category) {
  const q = encodeURIComponent(category || "");
  const data = await apiFetch(`${ESG_PREFIX}/answers/me?category=${q}`);
  return data.answers || {};
}

// 일괄 저장: answers = [{category, questionid, question, answer}]
export async function saveEsgAnswersBulk(answers) {
  const payload = { answers: Array.isArray(answers) ? answers : [] };
  return apiFetch(`${ESG_PREFIX}/answers/bulk`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMyEsgReport() {
  const data = await apiFetch(`${ESG_PREFIX}/report/me`);
  return data.report || [];
}
