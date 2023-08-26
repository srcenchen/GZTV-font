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
import { Message, Upload } from "@arco-design/web-react";

function VideoManager() {
  const [data, setData] = React.useState([]);
  const videoRef: any = React.useRef(null);
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
    { columnKey: "UploadDate", label: "时间" },
    { columnKey: "action", label: "操作" },
  ];
  return (
    <div className="flex flex-col justify-center ">
      <Title2 className="mb-2 ml-2">{"视频管理"}</Title2>
      <UploadVideoDialog
        videoRef={videoRef}
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
                  <TableCell>{item.UploadDate}</TableCell>
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

// 上传视频弹窗
function UploadVideoDialog(prop: {
  videoRef: any;
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
  // 上传视频
  const uploadVideo = () => {
    // 判断是否符合条件
    if (prop.title === "") {
      Message.error("请输入视频标题");
      return;
    }
    if (prop.description === "") {
      Message.error("请输入视频简介");
      return;
    }
    if (!prop.videoSelected) {
      Message.error("请选择视频");
      return;
    }
    if (!prop.imageSelected) {
      Message.error("请选择封面");
      return;
    }

    // 上传视频
    prop.setUploading(true);
    prop.videoRef.current.submit();
    prop.imageRef.current.submit();
  };

  // 时刻监听视频和图片的上传状态
  useEffect(() => {
    if (prop.videoName && prop.imageName && prop.uploading) {
      axios
        .post("/api/addVideo", {
          title: prop.title,
          description: prop.description,
          video: prop.videoName,
          cover: prop.imageName,
        })
        .then((res) => {
          if (res.data["message"] === "success") {
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
            Message.error("发布失败");
            prop.setUploading(false);
          }
        });
    }
  }, [prop.videoName, prop.imageName]);

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
          发布视频
        </Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle action={null}>发布视频</DialogTitle>
          <DialogContent>
            <div className="flex flex-col">
              <Input
                placeholder="请输入视频标题"
                value={prop.title}
                onChange={(e) => {
                  prop.setTitle(e.target.value);
                }}
              ></Input>
              <div className="mt-2" />
              <Textarea
                placeholder="请输入视频简介"
                value={prop.description}
                onChange={(e) => {
                  prop.setDescription(e.target.value);
                }}
              ></Textarea>
              <div className="mt-2">
                <VideoChoose
                  videoRef={prop.videoRef}
                  setVideoName={prop.setVideoName}
                  setVideoSelected={prop.setVideoSelected}
                  setProgress={prop.setProgress}
                />
                <ImageChoose
                  imageRef={prop.imageRef}
                  setImageName={prop.setImageName}
                  setImageSelected={prop.setImageSelected}
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              appearance="secondary"
              onClick={() => {
                prop.setOpen(false);
                // 清空数据
                prop.setVideoName("");
                prop.setImageName("");
                prop.setTitle("");
                prop.setDescription("");
                prop.setImageSelected(false);
                prop.setVideoSelected(false);
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
              {prop.uploading ? <Spinner size="small" /> : "上传并发布"}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

// 选择视频
function VideoChoose(prop: {
  videoRef: any;
  setVideoName: any;
  setProgress: any;
  setVideoSelected: any;
}) {
  return (
    <div className="flex flex-col" style={{overflow: "hidden"}}>
      <label className="mb-1">上传视频</label>
      <Upload
        action="/api/uploadVideo"
        ref={prop.videoRef}
        showUploadList={{
          startIcon: (
            <></>
          ),
          cancelIcon: (
            <></>
          )
        }}
        progressProps={{
          size: 'small',
          showText: true,
        }}
        drag
        limit={1}
        autoUpload={false}
        accept="video/*"
        onChange={(e: any) => {
          try {
            if (e[0].status === "done") {
              prop.setVideoName(e[0].response.file);
            }
          } catch (e) {}
          prop.setVideoSelected(true);
        }}
      ></Upload>
    </div>
  );
}

// 选择封面
function ImageChoose(prop: {
  imageRef: any;
  setImageSelected: any;
  setImageName: any;
}) {
  return (
    <div className="flex flex-col mt-2">
      <label className="mb-1">上传封面</label>
      <Upload
        className="w-18"
        action="/api/uploadImage"
        ref={prop.imageRef}
        listType="picture-card"
        limit={1}
        autoUpload={false}
        accept="image/*"
        onChange={(e: any) => {
          try {
            if (e[0].status === "done") {
              prop.setImageName(e[0].response.fileName);
            }
          } catch (e) {}
          prop.setImageSelected(true);
        }}
      ></Upload>
    </div>
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
            将要删除标题为 "{prop.item.Title}" 的视频
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
  axios.get("/api/getVideos").then((res) => {
    // 篡改uploadDate
    res.data.forEach((item: any) => {
      item.UploadDate = item.UploadDate.replace("T", " ").replace("Z", " ");
    });
    // res.data 反向排序
    res.data.reverse();
    setData(res.data);
  });
}

// 删除视频
function deleteVideo(id: any, setData: any) {
  axios.get("/api/deleteVideo?id=" + id).then((res) => {
    console.log(res);
    getData(setData);
  });
}

export default VideoManager;
