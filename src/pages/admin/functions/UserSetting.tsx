import { Input, Title2, Button } from "@fluentui/react-components";
import axios from "axios";
import React from "react";
import { Message } from "@arco-design/web-react";
import { Md5 } from "ts-md5";

function UserSetting() {
  return (
    <div className="flex flex-col justify-center ml-2">
      <Title2 className="mb-2 ">{"用户管理"}</Title2>
      <Settings />
    </div>
  );
}

function Settings() {
  const save = () => {
    if (username === "" || password === "") {
      Message.error("用户名或密码不能为空");
      return;
    }
    // 将密码md5
    const md5 = new Md5();
    const passwordMd5 = md5.appendStr(password).end();
    
    axios
      .get("/api/user/change-password?username=" + username + "&new_password=" + passwordMd5)
      .then((res) => {
        if (res.data.code == 0) {
          Message.success("修改成功");
          sessionStorage.clear();
          window.location.href = "/login";
        } else {
          Message.error("修改失败");
        }
      });
  };

  const [username, setUsername] = React.useState(
    sessionStorage.getItem("username") || ""
  );
  const [password, setPassword] = React.useState("");
  return (
    <div className="flex flex-col lg:w-1/3 mt-2">
      <Input
        placeholder="请输入用户名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled
      ></Input>
      <div className="mt-2" />
      <Input
        placeholder="请输入新密码"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      ></Input>
      <div className="mt-2" />
      <Button onClick={save}>保存</Button>
    </div>
  );
}

export default UserSetting;
