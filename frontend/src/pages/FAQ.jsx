import { useEffect, useState } from "react";
import { getPosts } from "../api.js";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";
import { FAQWrite, FAQHistory } from "./Query.jsx";
import styles from './css/FAQ.module.css';

function FAQ() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return (
    <>
      <nav>
        <Link to=''>문의 내역</Link>
        <Link to='write'>글쓰기</Link>
      </nav>
      <Outlet />

    </>
  );
}

export default FAQ;
