import { Button } from "@fluentui/react-button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Input,
  Textarea,
  Spinner,
} from "@fluentui/react-components";
import { Delete24Regular } from "@fluentui/react-icons";
import { Title2 } from "@fluentui/react-text";
import axios from "axios";
import React, { useEffect } from "react";
import { Message } from "@arco-design/web-react";

function VideoGroupManager() {
  const [data, setData] = React.useState([]);
  const imageRef: any = React.useRef(null);
  const [videoName, setVideoName] = React.useState("");
  const [imageName, setImageName] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [videoSelected, setVideoSelected] = React.useState(false);
  const [imageSelected, setImageSelected] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    // 从服务器获取数据
    getData(setData);
  }, []);

  const headers = [
    { columnKey: "Title", label: "标题" },
    { columnKey: "Description", label: "介绍" },
    { columnKey: "action", label: "操作" },
  ];
  return (
    <div className="flex flex-col justify-center ">
      <Title2 className="mb-2 ml-2">{"分组管理"}</Title2>
      <UploadVideoDialog
        imageRef={imageRef}
        videoName={videoName}
        imageName={imageName}
        title={title}
        description={description}
        uploading={uploading}
        open={open}
        setOpen={setOpen}
        setVideoName={setVideoName}
        setImageName={setImageName}
        setTitle={setTitle}
        setDescription={setDescription}
        setUploading={setUploading}
        setProgress={setProgress}
        setData={setData}
        setVideoSelected={setVideoSelected}
        setImageSelected={setImageSelected}
        progress={progress}
        imageSelected={imageSelected}
        videoSelected={videoSelected}
      />
      <div className="ml-4 mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHeaderCell key={header.columnKey}>
                  {header.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item: any, key: any) => {
              return (
                <TableRow key={key}>
                  <TableCell>{item.Title}</TableCell>
                  <TableCell>{item.Description}</TableCell>
                  <TableCell role="gridcell">
                    {deleteConfirm({ item, setData })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// 上传分组弹窗
function UploadVideoDialog(prop: {
  imageRef: any;
  videoName: string;
  imageName: string;
  title: string;
  description: string;
  uploading: boolean;
  open: boolean;
  setOpen: any;
  setVideoSelected: any;
  setImageSelected: any;
  progress: number;
  setProgress: any;
  setUploading: any;
  setVideoName: any;
  setImageName: any;
  setTitle: any;
  setData: any;
  setDescription: any;
  videoSelected: any;
  imageSelected: any;
}) {
  // 上传分组
  const uploadVideo = () => {
    // 判断是否符合条件
    if (prop.title === "") {
      Message.error("请输入分组标题");
      return;
    }
    if (prop.description === "") {
      Message.error("请输入分组简介");
      return;
    }

    // 上传分组
    prop.setUploading(true);
    prop.imageRef.current.submit();
  };

  // 时刻监听图片的上传状态
  if (prop.uploading) {
    axios
      .post("/api/video/add-video-group", {
        title: prop.title,
        description: prop.description,
        video_name: prop.videoName,
        head_image: prop.imageName,
      })
      .then((res) => {
        if (res.data.code == 0) {
          // 上传成功
          Message.success("发布成功");
          prop.setVideoName("");
          prop.setImageName("");
          prop.setTitle("");
          prop.setDescription("");
          prop.setImageSelected(false);
          prop.setVideoSelected(false);
          prop.setOpen(false);
          prop.setUploading(false);
          getData(prop.setData);
        } else {
          Message.error("发布失败," + res.data.message);
          prop.setUploading(false);
        }
      });
  }

  return (
    <Dialog
      open={prop.open}
      onOpenChange={() => {
        prop.setOpen(true);
      }}
    >
      <DialogTrigger disableButtonEnhancement>
        <Button
          appearance="primary"
          className="w-0"
          style={{ marginTop: "6px", marginLeft: "8px" }}
        >
          新建分组
        </Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle action={null}>新建分组</DialogTitle>
          <DialogContent>
            <div className="flex flex-col">
              <Input
                placeholder="请输入分组标题"
                value={prop.title}
                onChange={(e) => {
                  prop.setTitle(e.target.value);
                }}
              ></Input>
              <div className="mt-2" />
              <Textarea
                placeholder="请输入分组简介"
                value={prop.description}
                onChange={(e) => {
                  prop.setDescription(e.target.value);
                }}
              ></Textarea>
              <div className="mt-2"></div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              appearance="secondary"
              onClick={() => {
                prop.setOpen(false);
                // 清空数据
                prop.setImageName("");
                prop.setTitle("");
                prop.setDescription("");
                prop.setImageSelected(false);
              }}
              disabled={prop.uploading}
            >
              取消
            </Button>
            <Button
              appearance="primary"
              onClick={uploadVideo}
              disabled={prop.uploading}
            >
              {prop.uploading ? <Spinner size="small" /> : "发布"}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

// 删除确认弹窗
function deleteConfirm(prop: { item: any; setData: any }) {
  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button icon={<Delete24Regular />}></Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>删除警告</DialogTitle>
          <DialogContent>
            将要删除标题为 "{prop.item.Title}"
            的分组，该分组下所有视频将转为无分组状态
            <br />
            此操作不可逆，确认删除？
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="secondary">取消</Button>
            </DialogTrigger>
            <DialogTrigger>
              <Button
                appearance="primary"
                onClick={() => {
                  deleteVideo(prop.item.Id, prop.setData);
                }}
              >
                确认
              </Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

// 获取数据
function getData(setData: any) {
  axios.get("/api/video/get-video-list").then((res) => {
    // 篡改uploadDate
    res.data.data.list.forEach((item: any) => {
      item.UploadDate = item.UploadDate.replace("T", " ").replace("Z", " ");
    });
    // 只保留 group_id = -1 的数据
    res.data.data.list = res.data.data.list.filter((item: any) => {
      return item.GroupId == -1;
    });
    setData(res.data.data.list);
  });
}

// 删除分组
function deleteVideo(id: any, setData: any) {
  axios.post("/api/video/delete-video?id=" + id).then((res) => {
    console.log(res);
    getData(setData);
  });
}

export default VideoGroupManager;
