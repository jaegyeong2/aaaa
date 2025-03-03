import React from "react";
import Register from "./pages/Register"; 
import Login from "./pages/Login";
import Board from "./pages/Board";
import Post from "./pages/Post";
import Postview from "./pages/Postview";
import MyPosts from "./pages/Myposts";
import EditPost from "./pages/EditPost";
import { BrowserRouter, Route, Routes } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/board" element={<Board/>}/>
      <Route path="/post" element={<Post/>}/>
      <Route path="/postview" element={<Postview/>} />
      <Route path="/myposts" element={<MyPosts/>}/>
      <Route path="/editpost" element={<EditPost/>}/>
      <Route path="/postview/:postId" element={<PostView />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App
