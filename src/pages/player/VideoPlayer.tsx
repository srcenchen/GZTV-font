import { useEffect, useState } from "react";
import Headers from "../components/Headers";
import axios from "axios";
import flvjs from "flv.js";
import { Card, Subtitle2, Text, Title3 } from "@fluentui/react-components";
import Footers from "../components/Footer";

function VideoPlayer() {
  // 获取parms
  const params = new URLSearchParams(window.location.search);
  const videoID = params.get("videoID");
  // 加载数据
  const [videoDetail, setVideoDetail] = useState({
    Id: 0,
    Title: "Loading...",
    Description: "Loading...",
    UploadDate: "Loading...",
  });
  useEffect(() => {
    getVideoDetail(videoID, setVideoDetail);
  }, []);
  return (
    <div className="flex flex-col">
      <Headers components to="/onlineVideo" />
      <Bodies videoDetail={videoDetail} />
    </div>
  );
}

// Body
function Bodies(props: { videoDetail: any }) {
  useEffect(() => {
    // 文件名切割获取文件类型
    let videoSuffix = "mp4";
    if (props.videoDetail["VideoName"] !== undefined)
      videoSuffix = props.videoDetail["VideoName"].split(".")[1];

    if (!flvjs.isSupported() && videoSuffix === "flv") {
      alert("您的设备不支持播放flv,请更换浏览器或者使用其他设备");
    } else {
      // 使用flv.js播放视频
      const player = flvjs.createPlayer({
        type: videoSuffix,
        url: "/resource/upload/videos/" + props.videoDetail["VideoName"],
        isLive: false,
      });
      player.attachMediaElement(
        document.getElementById("videoPlayer") as HTMLVideoElement
      );
      player.load();
      player.play();
    }
  }, [props.videoDetail]);
  return (
    <div className="flex flex-col items-center md:items-start md:ml-24 md:mr-24 mt-4">
      <Title3 className="mb-4">{props.videoDetail.Title}</Title3>
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
            <Subtitle2 className="lg:ml-2 lg:mt-2">视频简介</Subtitle2>
            <Text className="lg:m-2 m-1">{props.videoDetail.Description}</Text>
            <Subtitle2 className="lg:ml-2 lg:mt-2">发布日期</Subtitle2>
            <Text className="lg:m-2 m-1">{props.videoDetail.UploadDate.replace("Z", "").replace("T", " ")}</Text>
          </div>
        </Card>
      </div>
      <Footers />
    </div>
  );
}

// 获取数据详细信息
function getVideoDetail(id: any, setVideoDetail: any) {
  axios.get("/api/video/get-video?id=" + id).then((res) => {
    document.title = res.data.data.video.Title;
    setVideoDetail(res.data.data.video);
  });
}

export default VideoPlayer;
