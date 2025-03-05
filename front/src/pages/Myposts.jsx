import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  &:hover {
    background-color: #f8f9fa;
  }
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const EditButton = styled(Button)`
  background-color: #007bff;
  color: white;
`;

const DeleteButton = styled(Button)`
  background-color: #dc3545;
  color: white;
`;

const MyPost = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyPosts = async () => {
    try {
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }
      
      setLoading(true);
      const response = await axios.get(
        "http://15.165.159.148:8000/posts/Myposts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("내 게시물 데이터:", response.data);
      setMyPosts(response.data);
    } catch (error) {
      console.error("내 게시물 불러오기 오류:", error.response?.data || error.message);
      if (error.response?.status === 404) {
        setMyPosts([]);
      } else {
        alert("게시물을 불러오는 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (postId) => {
    navigate(`/editpost/${postId}`);
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete("http://15.165.159.148:8000/posts/Delete", {
        params: { post_id: postId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      
      alert("게시물이 삭제되었습니다.");
      fetchMyPosts();
    } catch (error) {
      console.error("게시물 삭제 오류:", error.response?.data || error.message);
      alert(`게시물을 삭제하는 중 오류가 발생했습니다: ${error.response?.data?.detail || error.message}`);
    }
  };

  const handleViewPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleGoBack = () => {
    navigate("/board");
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  return (
    <Container>
      <Header>
        <Title>내 게시물</Title>
      </Header>
      
      {loading ? (
        <div>게시물을 불러오는 중...</div>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>번호</Th>
              <Th>제목</Th>
              <Th>작성일</Th>
              <Th>관리</Th>
            </tr>
          </thead>
          <tbody>
            {myPosts.length > 0 ? (
              myPosts.map((post) => (
                <PostRow key={post.id}>
                  <Td>{post.id}</Td>
                  <Td 
                    onClick={() => handleViewPost(post.id)} 
                    style={{ cursor: 'pointer' }}
                  >
                    {post.title}
                  </Td>
                  <Td>{new Date(post.created_at).toLocaleDateString()}</Td>
                  <Td>
                    <EditButton onClick={() => handleEdit(post.id)}>수정</EditButton>
                    <DeleteButton onClick={() => handleDelete(post.id)}>삭제</DeleteButton>
                  </Td>
                </PostRow>
              ))
            ) : (
              <tr>
                <Td colSpan="4" style={{ textAlign: "center" }}>
                  작성한 게시물이 없습니다.
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      <ButtonGroup>
        <Button onClick={handleGoBack}>목록</Button>
      </ButtonGroup>
    </Container>
  );
};

export default MyPost;
