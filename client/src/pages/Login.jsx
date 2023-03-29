import React, { useContext, useEffect } from "react";
import { Form, Button, Input, Typography, message } from "antd";
import styled from "styled-components";
import { Link, useHistory, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux';
import { LoginandNavigateUser } from "../api/authAPI";
import axios from "../axios"
const LoginForm = styled.div`
  .Login {
    height: 100vh;
    display: flex;
    flex-direction: row;
    @media (max-width: 768px) {
      flex-direction: column;
    }
    @media (max-height: 628px) {
      flex-direction: column;
    }
    justify-content: center;
    align-items: center;
  
    background-color: #9053c7;
    background-image: linear-gradient(-135deg,#c850c0,#4158d0);
    overflow: hidden;
  }
  .Login-header {
    height:70vh;
    max-width: 840px;
    width: 100%;
    display:flex;
    justify-content: space-around;
    background-color: #fff;
    padding: 25px 30px;
    border-radius: 5px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  }
  .Div-img{
    width: 35%;
  }
  .Img{
    max-width: 100%;
  }
  .ant-typography {
    font-size: 45px;
    font-weight: 500;
    position: relative;
  }
  .ant-input-affix-wrapper {
    box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
      rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
      rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
  }
  .ant-select {
    box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
      rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
      rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
  }
  .sign {
    display:flex;
    justify-content:flex-end;
  }
`;
const ButtonContainer = styled.div`
  .ant-btn-primary {
    height: 100%;
    width: 100%;
    border-radius: 5px;
    border: none;
    color: #fff;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
     background-color: #bd59d4;
    &:hover{
     background-color: #4b2354;
       box-shadow: 0 10px 30px 0 rgb(189 89 212 / 80%);
    }
  }
`;



const { Title } = Typography;

function Login() {
     const dispatch = useDispatch()
  const [form] = Form.useForm();
  /* const history = useHistory() */
  const navigate = useNavigate();
  const success = () => {
    message.success({
      content: "Đăng nhập thành công",
      className: "custom-class",
      style: {
        marginTop: "20vh",
      },
    });
  };
  const failed403 = () => {
    message.error({
      content: "Role của bạn chưa được xác nhận, từ chối đăng nhập",
      className: "custom-class",
      style: {
        marginTop: "20vh",
      },
    });
  };
  const failed400 = () => {
    message.error({
      content: "Email, số điện thoại hoặc mật khẩu không đúng",
      className: "custom-class",
      style: {
        marginTop: "20vh",
      },
    });
  };
  const email = Form.useWatch("email", form);
  let password = Form.useWatch("password", form);

  const onFinish = async () => {
    try {
       const response = await axios.post('/auth/login',{   
          email: email,
          password: password 
      })
      console.log(response)
      success();  
      LoginandNavigateUser(dispatch, response.data)
    /*   const { data } = response.data; */
      setTimeout(() => {
            /* history.push("/") */
         navigate('/home', { replace: true });
           }, 1000);
     console.log(response)
      
    } catch (error) {
      if (error.message === "Request failed with status code 403") {
        failed403();
      }
      if (error.message === "Request failed with status code 400") {
        failed400();
      }
    }
  };
  return (
    <LoginForm>
      <div className="Login">
        <div className="Login-header">
          <div className="Div-img">
            <img
              className="Img"
              src="https://colorlib.com/etc/lf/Login_v1/images/img-01.png"
            />
          </div>
          <Form
            className="px-6 w-[60%]"
            form={form}
            autoComplete="off"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            onFinish={onFinish}
            onFinishFailed={(error) => {
              console.log({ error });
            }}
          >
            {/* <Title level={1} className="text-center">
                qw
            </Title> */}
            <div className="flex justify-center items-center mb-3 ">
              <div className="py-[7px] px-12 ml-[50px]  bg-gray-200 text-base font-semibold border-r-[1px] rounded-tl-md rounded-bl-md cursor-pointer">
                <Link to="/register">SIGN UP</Link>
              </div>
              <div className="py-[7px] px-12  bg-gray-400 text-base font-semibold rounded-tr-md rounded-br-md cursor-pointer">
                SIGN IN
              </div>
            </div>
            <div className="flex justify-start items-center mb-4 flex-col">
              <div className="ml-[50px] text-3xl font-bold text-left">
                Login
              </div>
              {/*  <div className="text-sm font-thin text-left">welcome back</div> */}
            </div>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email hoặc số điện thoại",
                },
                {
                  type: "email",
                  message: "Vui lòng nhập E-mail!",
                },
              ]}
              hasFeedback
            >
              <Input placeholder="Nhập email hoặc số điện thoại" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu",
                },
                {
                  min: 6,
                  message: "Mật khẩu phải dài hơn 6 chữ số",
                },
                {
                  max: 24,
                  message: "Mật khẩu chỉ được tối đa 24 chữ số",
                },
              ]}
              hasFeedback
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="sign">
                Don't have a account?
                <Link
                  to="/register"
                  className="font-semibold text-blue-700"
                >
                  <div className="pl-1">Sign up</div>
                </Link>
              </div>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 24 }}>
              <div className="flex justify-end mt-[-20px]">
                <Link
                  to="/forgot-password"
                  className="font-semibold text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>
            </Form.Item>

            <div className="flex justify-end mt-[-10px]">
              <ButtonContainer className="w-[312px]">
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  className="w-[100%]"
                >
                  Login
                </Button>
              </ButtonContainer>
            </div>
          </Form>
        </div>
      </div>
    </LoginForm>
  );
}

export default Login;
