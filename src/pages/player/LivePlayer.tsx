import { useEffect, useState } from "react";
import Headers from "../components/Headers";
import axios from "axios";
import { Card, Subtitle2, Text, Title3 } from "@fluentui/react-components";
import Footers from "../components/Footer";
import Hls from "hls.js";

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
  useEffect(() => {
    getLiveDetail(liveID, setLiveDetail, setLoadState);
  }, []);
  return (
    <div className="flex flex-col">
      <Headers components to="/liveRoom" />
      <Bodies liveDetail={liveDetail} loadSuccess={loadState} />
    </div>
  );
}

// Body
function Bodies(props: { liveDetail: any; loadSuccess: boolean }) {
  useEffect(() => {
    // 使用hls.js播放
    // 判断是否为手机
    function isMobile() {
      return navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i);
    }

    function isSSL() {
      return window.location.protocol === "https:";
    }

    const playUrl = () => {
      // 获取hostName
      const hostName = window.location.hostname;
      const port = isSSL() ? "4433" : "6021";
      return `//${hostName}:${port}/hls/${props.liveDetail.StreamName}.m3u8`;
    };

    if (!isMobile()) {
      var video = document.getElementById("videoPlayer") as HTMLVideoElement;
      var hls = new Hls();
      hls.attachMedia(video);
      hls.loadSource(playUrl());
    } else {
      // 使用原生播放器
      var video = document.getElementById("videoPlayer") as HTMLVideoElement;
      video.src = playUrl();
    }

    // 判断是否有信号
    if (props.liveDetail.LiveState != true && props.loadSuccess) {
      alert("当前直播未开播");
      // 跳回直播大厅
      window.location.href = "/liveRoom";
    }
  }, [props.liveDetail]);
  return (
      <div className="flex flex-col items-center md:items-start md:ml-24 md:mr-24 ml-2 mr-2 mt-4">
      <Title3 className="mb-4">{props.liveDetail.Title}</Title3>
      <div className="w-full flex flex-col lg:flex-row">
        <video
          id="videoPlayer"
          controls
          className="lg:w-3/4 w-full"
          autoPlay
        ></video>
        <Card
          className="lg:w-1/4 w-full lg:ml-4 mt-4 lg:mt-0"
          appearance="outline"
        >
          <div className="flex flex-col flex-1">
            <Subtitle2 className="lg:ml-2 lg:mt-2">直播简介</Subtitle2>
            <Text className="lg:m-2 m-1">{props.liveDetail.Description}</Text>
            <Subtitle2 className="lg:ml-2 lg:mt-2">发布日期</Subtitle2>
            <Text className="lg:m-2 m-1"> {props.liveDetail.SubmitDate.replace("Z", "").replace("T", " ")}</Text>
          </div>
        </Card>
      </div>
      <Footers />
    </div>
  );
}

// 获取数据详细信息
function getLiveDetail(id: any, setLiveDetail: any, setLoadState: any) {
  axios.get("/api/live/get-live?id=" + id).then((res) => {
    document.title = res.data.data.live.Title;
    setLiveDetail(res.data.data.live);
    setLoadState(true);
  });
}

export default LivePlayer;
