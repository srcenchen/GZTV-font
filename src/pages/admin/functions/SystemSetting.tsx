import { Message, Radio } from "@arco-design/web-react";
const RadioGroup = Radio.Group;
import { Button, Subtitle2, Title2, Text } from "@fluentui/react-components";
import axios from "axios";
import React, { useEffect } from "react";

function SystemSetting() {
  return (
    <div className="flex flex-col justify-center ml-2">
      <Title2 className="mb-2">{"系统设置"}</Title2>

      <div className="flex flex-col mt-2">
        <PlayStream />
        <VersionInfo />
      </div>
    </div>
  );
}

function PlayStream() {
  const [pullSetting, setPullSetting] = React.useState("");
  useEffect(() => {
    axios.get("/api/setting/get-pull-setting").then((res) => {
      setPullSetting(res.data["data"]["pull_setting"]);
    });
  }, []);
  return (
    <div className="flex flex-col">
      <Subtitle2>{"默认拉流协议"}</Subtitle2>
      <RadioGroup
        name="lang"
        className="mt-2"
        value={pullSetting}
        onChange={(e) => {
          setPullSetting(e);
        }}
      >
        <Radio value="HLS-M3U8">HLS-M3U8</Radio>
        <Radio value="RTMP-FLV">RTMP-FLV</Radio>
      </RadioGroup>
      <Text className="ml-2 mr-2 mb-1 mt-2">
        RTMP-FLV的延迟较小,一般在5秒以内,但是首次加载时间较长,大约5-7秒左右
      </Text>
      <Text className="ml-2 mr-2 mb-1">
        HLS-M3U8的延迟较大,一般在20-30秒左右,但基本可以达到秒开效果
      </Text>
      <Text className="ml-2 mr-1 mb-1">
        若不是对延迟有特别大的要求,优先考虑HLS-M3U8,对于内网环境,可以考虑RTMP-FLV
      </Text>
      <Text className="ml-2 mr-1">
        由于iOS端不支持RTMP-FLV 在iOS端将强制使用HLS-M3U8 (此协议是苹果提出的)
      </Text>
      <div className="mt-2" />
      <Button
        className="w-0"
        onClick={() => {
          axios
            .get("/api/setting/set-pull-setting?pull_setting=" + pullSetting)
            .then((res) => {
              if (res.data.code == 0) {
                Message.success("默认拉流协议 修改成功");
              } else {
                Message.error("默认拉流协议 修改失败");
              }
            });
        }}
      >
        保存
      </Button>
    </div>
  );
}

function VersionInfo() {
  const [versionInfo, setVersionInfo] = React.useState("v0.0.0");
  useEffect(() => {
    axios.get("/api/setting/get-version").then((res) => {
      setVersionInfo(res.data["data"]["version"]);
    });
  }, []);
  return (
    <div className="flex flex-col mt-4">
      <Subtitle2>{"版本信息"}</Subtitle2>
      <Text className="ml-2 mr-2 mt-2">版本: {versionInfo}</Text>

      <Subtitle2 className="mt-4">{"项目源码仓库"}</Subtitle2>
      <div className="mt-2" />
      <div>
        <Button
          className="w-0"
          onClick={() => {
            window.open("https://github.com/srcenchen/eGZ-GZTV/");
          }}
        >
          Github
        </Button>
        <Button
          className="w-0 ml-2"
          onClick={() => {
            window.open("https://github.com/srcenchen/eGZ-GZTV/releases/latest/");
          }}
        >
          最新发行版
        </Button>
      </div>
    </div>
  );
}
export default SystemSetting;
