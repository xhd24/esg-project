import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Dohui112618@",
    database: "node_react_board",
    waitForConnections: true,
    connectionLimit: 10,
});

export async function getQueryHx() {
    const [rows] = await pool.query(
        "SELECT post_id, title, user_id, created_at FROM posts ORDER BY post_id DESC"
    );
    return rows;
}

export async function addQuery(title, content, user_id) {
  await pool.query(
    "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
    [title, content, user_id]
  );
}