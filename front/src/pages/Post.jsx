import React, { useState } from 'react';
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 400px;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 16px;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  
  ${props => props.primary ? `
    background-color: black;
    color: white;
  ` : `
    background-color: white;
    color: black;
    border: 1px solid black;
  `}
`;

const Post = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {

      const userId = JSON.parse(atob(localStorage.getItem('access_token').split('.')[1])).sub;

      await axios.post("http://15.165.159.148:8000/posts/Create", {
        title,
        content,
        user_id: userId 
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      alert('게시글 작성 성공');
      navigate('/board');
    } catch (error) {
      console.error(error);
      alert('게시글 작성에 실패했습니다.');
    }
  };

  return (
    <Container>
      <Title>글쓰기</Title>
      <Input
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextArea
        placeholder="내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <ButtonGroup>
        <Button onClick={handleSubmit}>등록</Button>
        <Button onClick={() => navigate('/board')}>취소</Button>
      </ButtonGroup>
    </Container>
  );
};

export default Post;
