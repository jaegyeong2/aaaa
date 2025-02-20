import React, { useEffect, useState } from 'react';
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

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  width: 100%;
  position: relative;
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
`;

const RegisterButton = styled.button`
  width: 93%;
  padding: 15px;
  background-color: black;
  color: white;
  font-size: 17px;
  font-weight: bold;
  border-radius: 5px;
  margin-left: 14px;
`;

const ErrorText = styled.div`
  color: red;
  font-size: 12px;
  margin-bottom: 20px;
  min-height: 14px;
  margin-left: 14px;
  margin-bottom: 20px;
`;

const Register = () => {
  const [id, setID] = useState(""); 
  const [pw, setPW] = useState("");
  const [email, setEmail] = useState(""); 
  const [pwc, setPWc] = useState("");
  const [idError, setIdError] = useState("");
  const [pwError, setPwError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pwcError, setPwcError] = useState("");

  const navigate = useNavigate();

  const handleChangeId = (e) => setID(e.target.value);
  const handleChangePw = (e) => setPW(e.target.value);
  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleChangePwc = (e) => setPWc(e.target.value);

  const backendRegister = async () => {
    if (!id || !pw || !pwc || !email || idError || pwError || pwcError || emailError) {
      alert("모든 항목을 올바르게 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post("http://15.165.159.148:8000/users/register", {
        "email": email,  
        "password": pw,
        "username": id,  
      });
      console.log(response);
      alert("회원가입 성공");
      navigate("/");
    } catch (error) {
      console.log("에러:", error);
      if (error.response) {
        alert(error.response.data.detail || "회원가입 실패");
      } else if (error.request) {
        alert("서버와의 연결에 문제가 있습니다.");
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    if (!id) {
      setIdError("아이디를 입력하세요.");
    } else {
      setIdError("");
    }

    if (!pw) {
      setPwError("비밀번호를 입력하세요.");
    } else if (/\s/.test(pw)) {
      setPwError("비밀번호에 공백이 포함될 수 없습니다.");
    } else {
      setPwError("");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("이메일을 입력하세요.");
    } else if (!emailRegex.test(email)) {
      setEmailError("올바른 이메일 형식을 입력하세요.");
    } else {
      setEmailError("");
    }
  }, [id, pw, email]);

  useEffect(() => {
    if (!pwc) {
      setPwcError("비밀번호가 일치하지 않습니다.");
    } else if (pwc !== pw) {
      setPwcError("비밀번호가 일치하지 않습니다.");
    } else {
      setPwcError("");
    }
  }, [pw, pwc]);

  return (
    <Container>
      <Frame>
        <Title>회원가입</Title>
        <br /><br />
        <InputGroup>
          <Input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={handleChangeId}
          />
        </InputGroup>
        <ErrorText>{idError}</ErrorText>
        <Input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={handleChangePw}
        />
        <ErrorText>{pwError}</ErrorText>
        <Input
          type="password"
          placeholder="비밀번호 확인"
          value={pwc}
          onChange={handleChangePwc}
        />
        <ErrorText>{pwcError}</ErrorText>
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={handleChangeEmail}
        />
        <ErrorText>{emailError}</ErrorText>
        <RegisterButton onClick={backendRegister}>
          가입하기
        </RegisterButton>
      </Frame>
    </Container>
  );
};

export default Register;
