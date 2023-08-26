import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Headers from "../components/Headers";
import { Divider } from "@fluentui/react-divider";
import { Text } from "@fluentui/react-text";
import { Tab, TabList } from "@fluentui/react-tabs";
import React from "react";
import {
  Live24Regular,
  Notepad24Regular,
  PersonAccounts24Regular,
  VideoClip24Regular,
} from "@fluentui/react-icons";

function Sider() {
  // 有关浏览器宽度问题
  const [width, setWidth] = React.useState(window.innerWidth);
  const [tabWidth, setTabWidth] = React.useState("13.5rem");
  const updateWidth = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    if (width < 591) {
      setTabWidth("3.5rem");
    } else {
      setTabWidth("13.5rem");
    }
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  type Tabs = {
    id: string;
    name: string;
    icon: React.ReactElement;
  };
  const tabs: Tabs[] = [
    {
      id: "/admin/videoManager",
      name: "视频管理",
      icon: <VideoClip24Regular />,
    },
    {
      id: "/admin/liveManager",
      name: "直播管理",
      icon: <Live24Regular />,
    },
    {
      id: "/admin/noticePad",
      name: "公告管理",
      icon: <Notepad24Regular />,
    },
    {
      id: "/admin/userSetting",
      name: "用户管理",
      icon: <PersonAccounts24Regular />,
    },
  ];

  // 当width小于591时候，
  if (width < 591) {
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
      <TabList
        vertical
        defaultSelectedValue={selectedTab}
        className="mt-2"
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
      <Divider vertical />
    </div>
  );
}

function AdminUI() {
  const [outerHeight, setOuterHeight] = React.useState(window.innerHeight);
  const updateHeight = () => {
    setOuterHeight(window.innerHeight);
  };
  // 判断是否有权
  verifty();
  useEffect(() => {
    document.title = "后台管理";
    // 添加监听器
    window.addEventListener("resize", updateHeight);
    updateHeight();
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  });
  return (
    <div className="flex flex-col">
      <Headers components="" to="/onlineVideo" />
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

function verifty() {
  if (sessionStorage.getItem("username") === null) {
    window.location.href = "/login";
  }
}

export default AdminUI;
