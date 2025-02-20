import React, { useState } from 'react';
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: black;
`;

const Frame = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 360px;
  padding: 100px;
  height: 400px;
  background-color: white;
  color: black;
  border-radius: 25px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  position: absolute;
  top: 70px;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 28px;
`;

const Input = styled.input`
  width: 93%;
  padding: 15px;
  border: 1px solid #333;
  background-color: lightgray;
  color: black;
  border-radius: 4px;
  font-size: 15px;
  box-sizing: border-box;
  margin-left: 14px;
  margin-bottom: 20px;
`;

const LoginButton = styled.button`
  width: 93%;
  padding: 15px;
  background-color: black;
  color: white;
  font-size: 17px;
  font-weight: bold;
  border-radius: 5px;
  margin-left: 14px;
  margin-bottom: 10px;
`;

const RegisterLink = styled.button`
  width: 93%;
  padding: 15px;
  background-color: white;
  color: black;
  font-size: 17px;
  font-weight: bold;
  border: 2px solid black;
  border-radius: 5px;
  margin-left: 14px;
  cursor: pointer;
`;

const Login = () => {
  const [id, setId] = useState("");  
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const urlEncodedData = new URLSearchParams();
      urlEncodedData.append('username', id); 
      urlEncodedData.append('password', password);

      const response = await axios.post(
        "http://15.165.159.148:8000/users/login",
        urlEncodedData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('token_type', response.data.token_type);

      alert("로그인 성공");
      navigate('/board');
    } catch (error) {
      console.error(error);
      alert('로그인에 실패했습니다.');
    }
  };

  return (
    <Container>
      <Frame>
        <Title>로그인</Title>
        <br /><br />
        <Input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}  
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <LoginButton onClick={handleLogin}>로그인</LoginButton>
        <RegisterLink onClick={() => navigate('/register')}>
          회원가입
        </RegisterLink>
      </Frame>
    </Container>
  );
};

export default Login;
