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

//조선소 외부 저장
export async function carb1InputQuery(ext) {
  const res = await fetch(`${BASE}/carbon/c1`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ext })
  });
  return res.json();
}

//조선소내부 저장
export async function carb1_1InputQuery(inn) {
  const res = await fetch(`${BASE}/carbon/c2`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ inn })
  });
  return res.json();
}

//각 테이블 값
export async function getCarbon(userKey) {
  const res = await fetch(`${BASE}/carbon/c3`,{
    method:'POST',
    headers: { 'Content-Type': 'application/json' },
    body:JSON.stringify({userKey})
  });
  return res.json();
}

//운항배출량 저장
export async function carb2InputQuery(form) {
  const res = await fetch(`${BASE}/carbon/c4`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ form })
  });
  return res.json();
}