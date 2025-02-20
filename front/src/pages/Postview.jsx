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
`;

const Content = styled.p`
  font-size: 18px;
  line-height: 1.7;
  margin-bottom: 40px;
`;

const ReadMoreButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
`;

const PostView = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isFullContentVisible, setIsFullContentVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`http://15.165.159.148:8000/posts/Read/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setPost(response.data);
    } catch (error) {
      console.error("게시글 불러오기 오류:", error);
      alert("게시글을 불러오는 중 오류가 발생했습니다.");
      navigate("/");
    }
  };

  const toggleContentVisibility = () => {
    setIsFullContentVisible(!isFullContentVisible);
  };

  if (!post) {
    return <p>로딩 중...</p>;
  }

  return (
    <Container>
      <Title>{post.title}</Title>
      <MetaInfo>
        작성자: {post.username || "알 수 없음"} |
        작성일: {post.created_at ? new Date(post.created_at).toLocaleDateString() : "알 수 없음"} |
        조회수: {post.view_count}
      </MetaInfo>
      <Content>
        {isFullContentVisible ? post.content : `${post.content.slice(0, 200)}...`}
      </Content>
      <ReadMoreButton onClick={toggleContentVisibility}>
        {isFullContentVisible ? "접기" : "더보기"}
      </ReadMoreButton>
    </Container>
  );
};

export default PostView;
