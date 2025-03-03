import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const MetaInfo = styled.div`
  color: #555;
  font-size: 14px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
`;

const PostInfo = styled.div`
  display: flex;
  gap: 15px;
`;

const Content = styled.div`
  font-size: 16px;
  line-height: 1.6;
  min-height: 300px;
  padding: 10px 0;
  margin-bottom: 20px;
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

const PostView = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 게시글 ID가 유효한지 확인
    if (!postId || isNaN(parseInt(postId, 10))) {
      console.error("유효하지 않은 게시글 ID:", postId);
      navigate("/board");
      return;
    }
    
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://15.165.159.148:8000/posts/Read/${parseInt(postId, 10)}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("게시글 불러오기 오류:", error.response?.data || error.message);
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
        navigate("/board");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [postId, navigate]);

  const handleGoBack = () => {
    navigate("/board");
  };

  if (loading) return <Container><div>게시글을 불러오는 중...</div></Container>;
  if (!post) return <Container><div>게시글을 찾을 수 없습니다.</div></Container>;

  return (
    <Container>
      <Title>{post.title}</Title>
      <MetaInfo>
        <PostInfo>
          <div>작성자: {post.username}</div>
          <div>작성일: {new Date(post.created_at).toLocaleDateString()}</div>
        </PostInfo>
      </MetaInfo>
      <Content>{post.content}</Content>
      <ButtonGroup>
        <Button onClick={handleGoBack}>목록</Button>
      </ButtonGroup>
    </Container>
  );
};

export default PostView;