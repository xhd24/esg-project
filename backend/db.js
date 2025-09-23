import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234@",
    database: "node_react_board",
    waitForConnections: true,
    connectionLimit: 10,
});

export async function getPosts() {
    const [rows] = await pool.query(
        "SELECT post_id, title, user_id, created_at FROM posts ORDER BY post_id DESC"
    );
    return rows;
}