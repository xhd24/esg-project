const BASE = "http://localhost:3000";

//FAQ 게시판 히스토리
export async function getQueryHx(userId) {
  const res = await fetch(`${BASE}/faq`, {
    method: 'POST',
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
    body: JSON.stringify({ inquiry_title, requester, company, email, category, content }),
  });
  return res.json();
}

//로그인
export async function login(id, pw) {
  const res = await fetch(`${BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, pw })
  });
  return res.json();
}