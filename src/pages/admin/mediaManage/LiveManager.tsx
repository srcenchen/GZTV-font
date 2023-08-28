import { Message, Upload } from "@arco-design/web-react";
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
  Badge,
  Spinner,
  Label,
} from "@fluentui/react-components";
import {
  AppsListDetail24Filled,
  Copy24Regular,
  Delete24Regular,
} from "@fluentui/react-icons";
import { Title2 } from "@fluentui/react-text";
import axios from "axios";
import React, { useEffect } from "react";

function LiveManager() {
  const [data, setData] = React.useState([]);
  const imageRef: any = React.useRef(null);
  const [imageName, setImageName] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [imageSelected, setImageSelected] = React.useState(false);

  useEffect(() => {
    // 从服务器获取数据
    getData(setData);
  }, []);
  const headers = [
    { columnKey: "Title", label: "标题" },
    { columnKey: "Description", label: "简介" },
    { columnKey: "state", label: "状态" },
    { columnKey: "date", label: "时间" },
    { columnKey: "action", label: "操作" },
  ];
  return (
    <div className="flex flex-col justify-center ">
      <Title2 className="mb-2 ml-2">{"直播管理"}</Title2>
      <UploadLiveDialog
        setData={setData}
        open={open}
        setOpen={setOpen}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        imageRef={imageRef}
        imageName={imageName}
        setImageName={setImageName}
        uploading={uploading}
        setUploading={setUploading}
        getData={getData}
        imageSelected={imageSelected}
        setImageSelected={setImageSelected}
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
                  <TableCell>
                    {item.LiveState === "true" ? (
                      <Badge appearance="filled" color="success">
                        直播中
                      </Badge>
                    ) : (
                      <Badge appearance="filled" color="danger">
                        无信号
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{item.SubmitDate}</TableCell>
                  <TableCell role="gridcell">
                    <div className="flex flex-row">
                      <DetailDialog item={item} />
                      <div className="ml-2" />
                      <DeleteConfirm item={item} setData={setData} />
                    </div>
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

// 上传Dialog
function UploadLiveDialog(prop: {
  open: boolean;
  setOpen: any;
  imageRef: any;
  imageName: string;
  setImageName: any;
  title: string;
  setTitle: any;
  description: string;
  setDescription: any;
  uploading: boolean;
  setUploading: any;
  getData: any;
  setData: any;
  setImageSelected: any;
  imageSelected: any;
}) {
  // 发起直播
  const addLive = () => {
    // 判断是否符合条件
    if (prop.title === "") {
      Message.error("请输入直播标题");
      return;
    }
    if (prop.description === "") {
      Message.error("请输入直播简介");
      return;
    }
    if (!prop.imageSelected) {
      Message.error("请选择封面");
      return;
    }

    // 添加直播
    prop.setUploading(true);
    prop.imageRef.current.submit();
  };

  // 时刻监听图片的上传状态
  useEffect(() => {
    if (prop.imageName && prop.uploading) {
      axios
        .post("/api/live/add-live", {
          title: prop.title,
          description: prop.description,
          head_image: prop.imageName,
        })
        .then((res) => {
          if (res.data.code == 0) {
            // 上传成功
            Message.success("发布成功");
            prop.setOpen(false);
            prop.setUploading(false);
            prop.setTitle("");
            prop.setDescription("");
            prop.setImageName("");
            prop.setImageSelected(false);
            getData(prop.setData);
          } else {
            Message.error("发布失败");
            prop.setUploading(false);
          }
        });
    }
  }, [prop.imageName]);

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
          发起直播
        </Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle action={null}>发布直播</DialogTitle>
          <DialogContent>
            <div className="flex flex-col">
              <Input
                placeholder="请输入直播标题"
                value={prop.title}
                onChange={(e) => {
                  prop.setTitle(e.target.value);
                }}
              ></Input>
              <div className="mt-2" />
              <Textarea
                placeholder="请输入直播简介"
                value={prop.description}
                onChange={(e) => {
                  prop.setDescription(e.target.value);
                }}
              ></Textarea>
              <Label className="mt-2">{"直播封面"}</Label>
              <div className="mt-2 flex flex-row">
                <ImageChoose
                  imageRef={prop.imageRef}
                  setImageSelected={prop.setImageSelected}
                  setImageName={prop.setImageName}
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
                prop.setTitle("");
                prop.setDescription("");
                prop.setImageName("");
                prop.setImageSelected(false);
              }}
              disabled={prop.uploading}
            >
              取消
            </Button>
            <Button
              appearance="primary"
              onClick={addLive}
              disabled={prop.uploading}
            >
              {prop.uploading ? <Spinner size="small" /> : "上传并发起"}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

// 选择图片
function ImageChoose(prop: {
  imageRef: any;
  setImageSelected: any;
  setImageName: any;
}) {
  return (
    <div className="flex flex-col">
      <Upload
        action="/api/upload/upload-image"
        ref={prop.imageRef}
        listType="picture-card"
        limit={1}
        autoUpload={false}
        accept="image/*"
        onChange={(e: any) => {
          try {
            if (e[0].status === "done") {
              prop.setImageName(e[0].response.data.fileName);
            }
          } catch (e) {
          }
          prop.setImageSelected(true);
        }}
      ></Upload>
    </div>
  );
}

// 删除确认弹窗
function DeleteConfirm(prop: { item: any; setData: any }) {
  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button icon={<Delete24Regular />}></Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>删除警告</DialogTitle>
          <DialogContent>
            将要删除标题为 "{prop.item.Title}" 的直播
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
                  deleteLive(prop.item.Id, prop.setData);
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

// 详细信息弹窗
function DetailDialog(prop: { item: any }) {
  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="primary" icon={<AppsListDetail24Filled />}></Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>直播详情</DialogTitle>
          <DialogContent>
            <div className="flex flex-col">
              <div className="flex flex-row items-center mt-2">
                <div className="w-1/4">推流地址：</div>
                <div className="w-3/4">
                  {"rtmp://" + window.location.hostname + ":1936/gztv/"}
                </div>
                <Button
                  appearance="primary"
                  icon={<Copy24Regular />}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      "rtmp://" + window.location.hostname + ":1936/gztv/"
                    );
                  }}
                ></Button>
              </div>
              <div className="flex flex-row items-center mt-2">
                <div className="w-1/4">推流码：</div>
                <div className="w-3/4">{prop.item.StreamName}</div>
                <Button
                  appearance="primary"
                  icon={<Copy24Regular />}
                  onClick={() => {
                    navigator.clipboard.writeText(prop.item.StreamName);
                  }}
                ></Button>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary">关闭</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}

// 获取数据
function getData(setData: any) {
  axios.get("/api/live/get-live-list").then((res) => {
    // 篡改uploadDate
    res.data.data.list.forEach((item: any) => {
      item.SubmitDate = item.SubmitDate.replace("T", " ").replace("Z", " ");
    });
    // res.data 反向排序
    res.data.data.list.reverse();
    setData(res.data.data.list);
  });
}

// 删除直播
function deleteLive(id: any, setData: any) {
  axios.post("/api/live/delete-live?id=" + id).then(() => {
    getData(setData);
  });
}

export default LiveManager;
