import { Button, Input } from "@fluentui/react-components";
import React, { useEffect, useState } from "react";
import Headers from "../components/Headers";
import axios from "axios";
import { Md5 } from "ts-md5";
import { useNavigate } from "react-router";
import { Message } from "@arco-design/web-react";

let navigate: (arg0: string) => void;
function AdminLogin() {
  navigate = useNavigate();
  useEffect(() => {
    document.title = "后台管理";
    verifty();
  }, []);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
      <Headers components="" to="/" />
      <div className="flex flex-col items-center mt-4">
        <label className="text-2xl">身份验证</label>
        <Input
          className="w-64 mt-4 mb-2"
          placeholder="请输入用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => onKeyDown(e, username, password)}
        ></Input>
        <Input
          className="w-64 mb-2"
          placeholder="请输入管理员密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => onKeyDown(e, username, password)}
        ></Input>
        <Button
          className="w-64"
          appearance="primary"
          onClick={() => {
            passwordVerify(username, password);
          }}
        >
          验证
        </Button>
      </div>
    </div>
  );
}

// 键盘事件
function onKeyDown(
  e: React.KeyboardEvent<HTMLInputElement>,
  username: string,
  password: string
) {
  // 回车建监听
  if (e.key === "Enter") {
    passwordVerify(username, password);
  }
}

function passwordVerify(username: string, password: string) {
  // 密码加密
  const passwordMd5 = Md5.hashStr(password);

  console.log(passwordMd5);
  const data = {
    username: username,
    password: passwordMd5,
  };

  // 发送密码验证请求
  axios.post("/api/user/login-verify", data).then((res) => {
    if (res.data.data.isSuccess) {
      sessionStorage.setItem("username", username);
      sessionStorage.setItem("password", passwordMd5);
      Message.success("Welcome" );
      goAdminUI();
    } else Message.error("用户名或密码错误");
  });
}

function verifty() {
  if (sessionStorage.getItem("username") !== null) {
    Message.success("Welcome");
    goAdminUI();
  } 
}

function goAdminUI() {
  navigate("/admin");
}

export default AdminLogin;
