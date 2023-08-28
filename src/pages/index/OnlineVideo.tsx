import axios from "axios";
import { useEffect, useState } from "react";
import Skeletons from "../components/Skeletons";
import {
  Body1,
  Body2,
  Card,
  Title2,
  Title3,
} from "@fluentui/react-components";

function OnlineVideo() {
  const [videoList, setVideoList] = useState([]);
  const [loadSuccess, setLoadSuccess] = useState(false);
  // 获取并解析数据
  useEffect(() => {
    getVideos(setVideoList, setLoadSuccess);
  }, []);
  return (
    <div className="flex flex-col">
      <Title2 className="mb-2 ml-2">{"在线视频"}</Title2>
      {loadSuccess ? <VideoList videoList={videoList} /> : <Skeletons />}
    </div>
  );
}

// 数据卡片
function VideoList(props: { videoList: any }) {
  return (
    <div>
      {props.videoList.length === 0 ? (
        <div className="flex justify-center">
          <Body2>暂无数据</Body2>
        </div>
      ) : null}
      {props.videoList.map((item: any, key: any) => {
        return (
          <div key={key}>
            <Card
              onClick={() => {
                itemClick(item.Id);
              }}
              appearance="subtle"
            >
              <div className="flex md:flex-row flex-col">
                <img
                  src={"/resource/upload/images/" + item.HeadImage}
                  className="rounded md:w-64 w-full"
                />
                <div className="flex flex-col justify-center md:ml-4 mt-1">
                  <Title3>{item.Title}</Title3>
                  <Body1 className="md:mt-1">{item.Description}</Body1>
                  <Body1>
                    {item.UploadDate.replace("T", " ").replace("Z", " ")}
                  </Body1>
                </div>
              </div>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

// 获取数据
function getVideos(
  setVideoList: React.Dispatch<React.SetStateAction<never[]>>,
  setLoadSuccess: React.Dispatch<React.SetStateAction<boolean>>
) {
  axios.get("/api/video/get-video-list").then((res) => {
    // res.data 反向排序
    res.data.data.list.reverse();
    setVideoList(res.data.data.list);
    setLoadSuccess(true);
  });
}

// item点击事件
function itemClick(id: number) {
  // 跳转到视频详情页
  window.location.href = "/videoPlayer?videoID=" + id;
}

export default OnlineVideo;
