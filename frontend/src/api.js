const BASE = "http://localhost:3000";

//FAQ 게시판 히스토리
export async function getQueryHx() {
    const res = await fetch(`${BASE}/faq`);
    return res.json();
}
//FAQ 게시판 글작성
export async function writeQuery(title,content) {
   const user_id = 'a';
  const res = await fetch(`${BASE}/faq/write`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, user_id }),
  });
  return res.json();
}