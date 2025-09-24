// test-db.js
import db from "./db.js";

async function testConnection() {
  try {
    const [rows] = await db.execute("SELECT NOW() AS currentTime");
    console.log("✅ DB 연결 성공:", rows[0].currentTime);
    process.exit(0); // 성공 시 종료
  } catch (err) {
    console.error("❌ DB 연결 실패:", err.message);
    process.exit(1); // 실패 시 종료
  }
}

testConnection();
