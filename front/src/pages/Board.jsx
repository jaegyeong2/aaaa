import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const WriteButton = styled.button`
  padding: 10px 20px;
  background-color: black;
  color: white;
  border-radius: 5px;
  cursor: pointer;
`;

const MyPostsButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
`;

const PostRow = styled.tr`
  cursor: pointer;
  &:hover {
    background-color: #f8f9fa;
  }
`;

const Board = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://15.165.159.148:8000/posts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      console.log("게시글 데이터:", response.data); // 데이터 확인
      setPosts(response.data);
    } catch (error) {
      console.error("게시글 불러오기 오류:", error);
      if (error.response?.status === 401) {
        navigate('/');
      }
    }
  };

  const handleMyPostsClick = () => {
    navigate('/myposts');  
  };

  return (
    <Container>
      <Header>
        <Title>게시판</Title>
        <div>
          <WriteButton onClick={() => navigate('/Post')}>글쓰기</WriteButton>
          <MyPostsButton onClick={handleMyPostsClick}>내 게시물</MyPostsButton>
        </div>
      </Header>
      <Table>
        <thead>
          <tr>
            <Th>번호</Th>
            <Th>제목</Th>
            <Th>작성자</Th>
            <Th>조회수</Th>
            <Th>작성일</Th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <PostRow key={post.id} onClick={() => navigate(`/postview${post.id}`)}>
              <Td>{post.id}</Td>
              <Td>{post.title}</Td>
              <Td>{post.username}</Td>
              <Td>{post.view_count}</Td>
              <Td>{new Date(post.created_at).toLocaleDateString()}</Td>
            </PostRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Board;
