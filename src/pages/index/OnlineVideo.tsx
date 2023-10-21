import axios from "axios";
import { useEffect, useState } from "react";
import Skeletons from "../components/Skeletons";
import {
  Body1,
  Body2,
  Card,
  Tab,
  TabList,
  Title2,
  Title3,
} from "@fluentui/react-components";

function OnlineVideo() {
  const [videoList, setVideoList] = useState([]);
  const [videoListTemp, setVideoListTemp] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [loadSuccess, setLoadSuccess] = useState(false);
  // 获取并解析数据
  useEffect(() => {
    getVideos(setVideoList, setVideoListTemp, setGroupList, setLoadSuccess);
  }, []);
  return (
    <div className="flex flex-col">
      <Title2 className="ml-2">{"在线视频"}</Title2>
      <div className="overflow-auto">
        <TabList
          defaultSelectedValue="-2"
          size="medium"
          onTabSelect={(_, data) => {
            // 根据分组id筛选视频
            if (data.value == "-2") {
              setVideoList(videoListTemp);
            } else {
              const video = videoListTemp.filter((item: any) => {
                return item.GroupId == data.value;
              });
              setVideoList(video);
            }
          }}
        >
          <Tab value="-2">首页</Tab>
          {groupList.map((item: any, key: any) => {
            return (
              <Tab key={key} value={item.Id}>
                {item.Title}
              </Tab>
            );
          })}
        </TabList>
      </div>

      {loadSuccess ? <VideoList videoList={videoList} /> : <Skeletons />}
    </div>
  );
}

// 数据卡片
function VideoList(props: { videoList: any }) {
  // item点击事件
  function itemClick(id: number) {
    // 跳转到视频详情页
    window.location.href = "/videoPlayer?videoID=" + id;
  }
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
                //navigate("/");
                itemClick(item.Id);
              }}
              appearance="subtle"
            >
              <div className="flex md:flex-row flex-col">
                <img
                  src={"/resource/upload/images/" + item.HeadImage}
                  className="rounded md:w-64 w-full md:h-36"
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
  setVideoListTemp: React.Dispatch<React.SetStateAction<never[]>>,
  setGroupList: React.Dispatch<React.SetStateAction<never[]>>,
  setLoadSuccess: React.Dispatch<React.SetStateAction<boolean>>
) {
  axios.get("/api/video/get-video-list").then((res) => {
    // res.data 反向排序
    // 只展示 group_id = -2 和 -1 的视频
    const video = res.data.data.list.filter((item: any) => {
      return item.GroupId != -1;
    });
    video.reverse();
    const group = res.data.data.list.filter((item: any) => {
      return item.GroupId == -1;
    });
    // group.reverse();
    setGroupList(group);
    setVideoList(video);
    setVideoListTemp(video);
    setLoadSuccess(true);
  });
}

export default OnlineVideo;
