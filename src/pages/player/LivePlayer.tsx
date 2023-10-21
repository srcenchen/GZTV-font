import { useEffect, useState } from "react";
import Headers from "../components/Headers";
import axios from "axios";
import { Card, Subtitle2, Text, Title3 } from "@fluentui/react-components";
import Footers from "../components/Footer";
import Hls from "hls.js";
import mpegts from "mpegts.js";
import { Radio } from "@arco-design/web-react";
const RadioGroup = Radio.Group;

function LivePlayer() {
  // 获取parms
  const params = new URLSearchParams(window.location.search);
  const liveID = params.get("liveID");
  // 加载数据
  const [liveDetail, setLiveDetail] = useState({
    Id: 0,
    Title: "Loading...",
    Description: "Loading...",
    SubmitDate: "Loading...",
  });
  const [loadState, setLoadState] = useState(false);
  const [pullMethod, setPullMethod] = useState("");
  useEffect(() => {
    getLiveDetail(liveID, setLiveDetail, setLoadState, setPullMethod);
  }, []);
  return (
    <div className="flex flex-col">
      <Headers components to="/liveRoom" />
      <Bodies
        liveDetail={liveDetail}
        loadSuccess={loadState}
        pullMethod={pullMethod}
        setPullMethod={setPullMethod}
      />
    </div>
  );
}

// Body
function Bodies(props: {
  liveDetail: any;
  loadSuccess: boolean;
  pullMethod: string;
  setPullMethod: any;
}) {
  useEffect(() => {
    // 使用hls.js播放
    // 判断是否为iOS
    function isIOS() {
      return navigator.userAgent.match(/(iPhone|iPod|ios)/i);
    }

    function isSSL() {
      return window.location.protocol === "https:";
    }

    const playUrlHls = () => {
      // 获取hostName
      const hostName = window.location.hostname;
      const port = isSSL() ? "4433" : "6021";
      return `//${hostName}:${port}/hls/${props.liveDetail.StreamName}.m3u8`;
    };

    const playUrlFlv = () => {
      // 获取hostName
      const hostName = window.location.hostname;
      const port = isSSL() ? "4433" : "6021";
      return `//${hostName}:${port}/live/${props.liveDetail.StreamName}.flv`;
    };

    if (!isIOS()) {
      var video = document.getElementById("videoPlayer") as HTMLVideoElement;
      console.log(props.pullMethod);
      // 判断拉流方式
      if (props.pullMethod == "HLS-M3U8") {
        // 使用hls.js播放
        var hls = new Hls();
        hls.attachMedia(video);
        hls.loadSource(playUrlHls());
      } else if (props.pullMethod == "RTMP-FLV") {
        // 使用mpegts.js播放
        var player = mpegts.createPlayer({
          type: "flv", // could also be mpegts, m2ts, flv
          isLive: true,
          url: playUrlFlv(),
        });
        player.attachMediaElement(video);
        player.load();
        player.play();
      }
    } else {
      // iOS 使用原生播放器 HLS
      props.setPullMethod("HLS-M3U8");
      var video = document.getElementById("videoPlayer") as HTMLVideoElement;
      video.src = playUrlHls();
    }

    // 判断是否有信号
    if (props.liveDetail.LiveState != true && props.loadSuccess) {
      alert("当前直播未开播");
      // 跳回直播大厅
      window.location.href = "/liveRoom";
    }
  }, [props.liveDetail, props.pullMethod]);
  return (
    <div className="flex flex-col items-center md:items-start md:ml-24 md:mr-24 mt-4">
      <Title3 className="mb-4" style={{ textAlign: "center" }}>
        {props.liveDetail.Title}
      </Title3>
      <div className="w-full flex flex-col lg:flex-row">
        <video
          id="videoPlayer"
          controls
          className="lg:w-3/4 w-full"
          autoPlay
        ></video>
        <Card
          className="lg:w-1/4 lg:ml-4 mt-4 lg:mt-0 ml-2 mr-2"
          appearance="outline"
        >
          <div className="flex flex-col flex-1">
            <Subtitle2 className="lg:ml-2 lg:mt-2">直播简介</Subtitle2>
            <Text className="lg:m-2 m-1">{props.liveDetail.Description}</Text>
            <Subtitle2 className="lg:ml-2 lg:mt-2">发布日期</Subtitle2>
            <Text className="lg:m-2 m-1">
              {" "}
              {props.liveDetail.SubmitDate.replace("Z", "").replace("T", " ")}
            </Text>
            <Text className="lg:ml-2 mt-2">直播卡顿?切换另一种方式试试!</Text>
            <RadioGroup
              name="lang"
              type="button"
              className="mt-2 flex justify-center items-center"
              value={props.pullMethod}
              onChange={(e) => {
                props.setPullMethod(e);
              }}
            >
              <Radio value="HLS-M3U8">HLS-M3U8</Radio>
              <Radio value="RTMP-FLV">RTMP-FLV</Radio>
            </RadioGroup>
          </div>
        </Card>
      </div>
      <Footers />
    </div>
  );
}

// 获取数据详细信息
function getLiveDetail(
  id: any,
  setLiveDetail: any,
  setLoadState: any,
  setPullMethod: any
) {
  axios.get("/api/live/get-live?id=" + id).then((res) => {
    document.title = res.data.data.live.Title;
    setLiveDetail(res.data.data.live);
    setPullMethod(res.data.data.pull);
    console.log(res.data.data.pull);
    setLoadState(true);
  });
}

export default LivePlayer;
