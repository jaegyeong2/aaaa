import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Container = styled.div`
  max-width: 900px;
  margin: 50px auto;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0px 5px 12px rgba(0, 0, 0, 0.15);
  background: #fff;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const MetaInfo = styled.div`
  color: #555;
  font-size: 15px;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ddd;
  display: flex;
  justify-content: space-between;
`;

const PostInfo = styled.div``;

const Content = styled.p`
  font-size: 18px;
  line-height: 1.6;
`;

const PostView = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        // URL 형식 수정 - 프로토콜이 누락되었던 부분 수정
        const response = await axios.get(
          `http://15.165.159.148:8000/posts/Read/${parseInt(postId, 10)}`
        );
        setPost(response.data);
        setError(null);
      } catch (error) {
        console.error("게시글 불러오기 오류:", error.response?.data || error.message);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [postId, navigate]);

  if (loading) return <Container>게시글을 불러오는 중...</Container>;
  if (error) return <Container>오류: {error}</Container>;
  if (!post) return <Container>게시글을 찾을 수 없습니다.</Container>;

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
    </Container>
  );
};

export default PostView;