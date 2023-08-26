import { Divider } from "@fluentui/react-components";
import Logo from "/src/assets/logo.png";
import React from "react";
import { useNavigate } from "react-router-dom";

function Headers(props: { components: React.ReactNode; to: string }) {
  const navigate = useNavigate();
  return (
    <div className="mt-2 flex-none">
      <div className="mb-2 flex items-center flex-none">
        <img
          src={Logo}
          width={256}
          className="ml-2 lg:ml-24 mr-2 cursor-pointer"
          onClick={() => {
            // 跳转到首页
            navigate(props.to);
          }}
        ></img>
        {props.components}
      </div>
      <Divider />
    </div>
  );
}

export default Headers;
