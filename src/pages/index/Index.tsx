import {
  Button,
  Divider,
  Tab,
  TabList,
  Text,
} from "@fluentui/react-components";
import { VideoClip24Regular, Live24Regular } from "@fluentui/react-icons";
import Headers from "../components/Headers";
import "uno.css";
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Notification } from "@arco-design/web-react";

function Sider() {
  // 有关浏览器宽度问题
  const [width, setWidth] = React.useState(window.innerWidth);
  const [tabWidth, setTabWidth] = React.useState("13.5rem");
  const updateWidth = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    if (width < 700) {
      setTabWidth("3.5rem");
    } else {
      setTabWidth("13.5rem");
    }
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, [width]);

  type Tabs = {
    id: string;
    name: string;
    icon: React.ReactElement;
  };
  const tabs: Tabs[] = [
    {
      id: "/onlineVideo",
      name: "在线视频",
      icon: <VideoClip24Regular />,
    },
    {
      id: "/liveRoom",
      name: "直播大厅",
      icon: <Live24Regular />,
    },
  ];

  // 当width小于700时候，
  if (width < 700) {
    // 删除tabs中name属性
    tabs.forEach((tab) => {
      tab.name = "";
    });
  }

  // 获取路由
  const location = useLocation();
  const [selectedTab, setSelectedTab] = React.useState(location.pathname);
  React.useEffect(() => {
    setSelectedTab(location.pathname);
  }, [location.pathname]);

  const navigate = useNavigate();

  return (
    <div className="flex-none lg:ml-32 ml-1 flex" style={{ width: tabWidth }}>
      <div className="flex flex-col items-center">
        <TabList
          vertical
          defaultSelectedValue={selectedTab}
          className="mt-2 flex-1"
          size="large"
          onTabSelect={(_, data) => {
            navigate(data.value as string);
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              icon={tab.icon}
              className="lg:w-48 md:w-48"
            >
              {tab.name}
            </Tab>
          ))}
        </TabList>
        {/* {width > 591 ? (
          <a href="https://www.upyun.com/?utm_source=lianmeng&utm_medium=referral">
            <img src={upyun} width={64} className="flex-none" />
          </a>
        ) : (
          <></>
        )} */}
      </div>

      <Divider vertical />
    </div>
  );
}

function Index() {
  const [outerHeight, setOuterHeight] = React.useState(window.innerHeight);
  const updateHeight = () => {
    setOuterHeight(window.innerHeight);
  };
  // 设置浏览器标题
  useEffect(() => {
    document.title = "赣中电视台";
    // 添加监听器
    window.addEventListener("resize", updateHeight);
    updateHeight();
    noticePad();
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col">
      <Headers
        components={
          <Button
            appearance="primary"
            onClick={() => {
              navigate("login");
            }}
          >
            后台管理
          </Button>
        }
        to="/onlineVideo"
      />
      <div className="flex lg:mr-24 mr-2 flex-1 ">
        <Sider />
        <div className="flex-1 h-auto">
          <div
            className="mt-4 overflow-auto"
            style={{ height: outerHeight - 141 }}
          >
            <Outlet />
          </div>
        </div>
      </div>
      <Divider />
      <div
        className="flex-none h-16 flex flex-col items-center justify-center"
        style={{ background: "rgb(250, 250, 252)" }}
      >
        <Text>本项目由伞恩晨同学开发维护并提供技术支持</Text>
        <Text>主办方：江苏省赣榆高级中学经济开发区校区</Text>
      </div>
    </div>
  );
}

// Notice 相关
function noticePad() {
  if (window.location.pathname == "/videoGroup")
    return;
  // 获取notice
  axios.get("/api/setting/get-notice").then((res) => {
    console.log(res);
    const data = res.data["data"]["notice"];
    if (data === "") return;
    Notification.success({
      title: "公告",
      content: data,
    });
  });
}

export default Index;
