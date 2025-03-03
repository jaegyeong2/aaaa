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

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: ${props => (props.delete ? "#dc3545" : "#007bff")};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Content = styled.p`
  font-size: 18px;
  line-height: 1.6;
`;

const PostView = () => {
  const { postId } = useParams();
  const numericPostId = parseInt(postId, 10); 
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://15.165.159.148:8000/posts/Read/${numericPostId}`
        );
        setPost(response.data);
      } catch (error) {
        console.error("게시글 불러오기 오류:", error.response?.data);
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
        navigate("/board");
      }
    };

    fetchPost();
  }, [numericPostId, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`http://15.165.159.148:8000/posts/Delete`, {
        data: { post_id: numericPostId }, 
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      alert("게시물이 삭제되었습니다.");
      navigate("/board");
    } catch (error) {
      console.error("게시물 삭제 오류:", error);
      alert("게시물을 삭제하는 중 오류가 발생했습니다.");
    }
  };

  if (!post) return <Container>게시글을 불러오는 중...</Container>;

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
        <Button onClick={() => navigate(`/Post?edit=${post.id}`)}>수정</Button>
        <Button delete onClick={handleDelete}>삭제</Button>
      </ButtonGroup>
    </Container>
  );
};

export default PostView;
