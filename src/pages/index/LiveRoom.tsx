import axios from "axios";
import { useEffect, useState } from "react";
import Skeletons from "../components/Skeletons";
import {
  Badge,
  Body1,
  Body2,
  Card,
  Title2,
  Title3,
} from "@fluentui/react-components";

function LiveRoom() {
  const [livesList, setLiveList] = useState([]);
  const [loadSuccess, setLoadSuccess] = useState(false);
  // 获取并解析数据
  useEffect(() => {
    getLives(setLiveList, setLoadSuccess);
  }, []);
  return (
    <div className="flex flex-col">
      <Title2 className="mb-2 ml-2">{"直播大厅"}</Title2>
      {loadSuccess ? <LiveList livesList={livesList} /> : <Skeletons />}
    </div>
  );
}

// 数据卡片
function LiveList(props: { livesList: any }) {
  return (
    <div>
      {props.livesList.length === 0 ? (
        <div className="flex justify-center">
          <Body2>暂无数据</Body2>
        </div>
      ) : null}
      {props.livesList.map((item: any, key: any) => {
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
                  className="rounded md:w-64 w-full md:h-36"
                />
                <div className="flex flex-col justify-center md:ml-4 mt-1">
                  <div className="flex items-center">
                    <Title3>{item.Title}</Title3>
                    {item.LiveState == true ? (
                      <Badge
                        appearance="filled"
                        className="ml-2"
                        color="success"
                      >
                        直播中
                      </Badge>
                    ) : (
                      <Badge
                        appearance="filled"
                        className="ml-2"
                        color="danger"
                      >
                        无信号
                      </Badge>
                    )}
                  </div>

                  <Body1 className="md:mt-1">{item.Description}</Body1>
                  <Body1>
                    {item.SubmitDate.replace("T", " ").replace("Z", " ")}
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
function getLives(
  setLiveList: React.Dispatch<React.SetStateAction<never[]>>,
  setLoadSuccess: React.Dispatch<React.SetStateAction<boolean>>
) {
  axios.get("/api/live/get-live-list").then((res) => {
    // res.data 反向排序
    res.data.data.list.reverse();
    setLiveList(res.data.data.list);
    setLoadSuccess(true);
  });
}

// item点击事件
function itemClick(id: number) {
  // 跳转到视频详情页
  window.location.href = "/livePlayer?liveID=" + id;
}

export default LiveRoom;
