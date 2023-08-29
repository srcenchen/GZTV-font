import { Message } from "@arco-design/web-react";
import {
  Button,
  ProgressBar,
  Textarea,
  Title2,
} from "@fluentui/react-components";
import axios from "axios";
import React, { useEffect } from "react";

function NoticePad() {
  const [data, setData] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    axios.get("/api/setting/get-notice").then((res) => {
      setData(res.data["data"]["notice"]);
      setLoading(false);
    });
  }, []);
  return (
    <div className="flex flex-col justify-center ml-2">
      <Title2 className="mb-2">{"公告管理"}</Title2>
      <div className="flex flex-col mt-2">
        {loading ? (
          <ProgressBar />
        ) : (
          <Textarea
            size="large"
            value={data}
            onChange={(e) => setData(e.target.value)}
          ></Textarea>
        )}
      </div>
      <div className="mt-2" />
      <Button className="w-0" onClick={() => {
        axios.get("/api/setting/set-notice?notice=" + data).then((res) => {
          if (res.data.code == 0) {
            Message.success("修改成功");
          } else {
            Message.error("修改失败");
          }
        });
      }}>
        保存
      </Button>
    </div>
  );
}

export default NoticePad;
