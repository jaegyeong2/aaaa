import React, { useState, useEffect } from 'react'; 
import styled from "styled-components"; 
import axios from "axios"; 
import { useNavigate, useParams } from 'react-router-dom';  

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
  background-color: ${props => props.primary ? 'black' : 'white'};
  color: ${props => props.primary ? 'white' : 'black'};
  border: ${props => props.primary ? 'none' : '1px solid black'};
`;  


const EditPost = () => {   
  const { postId } = useParams();   
  const [title, setTitle] = useState("");   
  const [content, setContent] = useState("");   
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();    

  useEffect(() => {     
    fetchPost();   
  }, [postId]);    

  const fetchPost = async () => {     
    try {
      setIsLoading(true);
      const response = await axios.get(`http://15.165.159.148:8000/posts/Read/${postId}`, {         
        headers: {           
          Authorization: `Bearer ${localStorage.getItem('access_token')}`         
        }       
      });              
      setTitle(response.data.title);       
      setContent(response.data.content);     
    } catch (error) {       
      console.error("게시글 불러오기 오류:", error);       
      alert("게시글을 불러오는 중 오류가 발생했습니다.");       
      navigate('/board');     
    } finally {
      setIsLoading(false);
    }
  };    

  const handleSubmit1 = async () => {
    try {
      await axios.put(
        `http://15.165.159.148:8000/posts/Update/${postId}`,  
        { title, content }, 
        { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
      );
  
      alert('게시글 수정 성공');
      navigate(`/postview/${postId}`);
    } catch (error) {
      console.error('Update error:', error.response?.data || error.message);
      
      if (error.response?.status === 403) {
        alert('게시글을 수정할 권한이 없습니다.');
      } else {
        alert('게시글 수정에 실패했습니다.');
      }
    }
  };
  
  

  return (     
    <Container>       
      <Title>게시글 수정</Title>       
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
        <Button onClick={handleSubmit1}>수정</Button>    
        <Button onClick={() => navigate(`/myposts`)}>취소</Button>               
      </ButtonGroup>     
    </Container>   
  ); 
};  

export default EditPost;