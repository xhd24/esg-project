const BASE = "http://localhost:3000";

export async function getPosts() {
    const res = await fetch(`${BASE}/faq`);
    return res.json();
}