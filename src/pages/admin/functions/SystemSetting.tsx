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
        RTMP-FLV的延迟较小,一般在5秒以内,但是此方式的加载时间较长,对服务器和网络要求比较大
      </Text>
      <Text className="ml-2 mr-2 mb-1">
        HLS-M3U8的延迟较大,一般在20-30秒左右,但基本可以达到秒开效果，对服务器和网络要求较小
      </Text>
      <Text className="ml-2 mr-1 mb-1">
        若不是对延迟有特别大的要求,优先考虑HLS-M3U8,服务器配置较低的,不建议选择RTMP-FLV
      </Text>
      <Text className="ml-2 mr-1">
        由于iOS端不支持RTMP-FLV 在iOS端将强制使用HLS-M3U8 (此协议是苹果提出的)
      </Text>
      <div className="mt-2" />
      <Button
        className="w-0"
        onClick={() => {
          axios.get("/api/setting/set-pull-setting?pull_setting=" + pullSetting).then((res) => {
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
export default SystemSetting;
