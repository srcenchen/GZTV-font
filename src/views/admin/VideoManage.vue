<script setup>
import {onMounted, ref, watchEffect} from "vue";
import axios from "axios";
import {POSITION, useToast} from "vue-toastification";

const tabs = ref([])
const items = ref([])
const item_temp = ref([])
const loading = ref(true)
const new_video_dialog = ref(false)
const new_select = ref(-2)
const new_title = ref("")
const new_description = ref("")
const new_video = ref("")
const new_cover = ref("")
const new_video_name = ref("")
const new_cover_name = ref("")
const uploading = ref(false)
const detail_video_dialog = ref(false)
const is_hide_main = ref(false)
const is_hide_group = ref(false)
onMounted(() => {
  load()
})

function load() {
  axios.get('/api/video/get-video-list').then((res) => {
    const video = res.data.data.list.filter((item) => {
      return item.GroupId !== -1;
    });
    video.reverse();
    const group = res.data.data.list.filter((item) => {
      return item.GroupId === -1;
    });
    // group.reverse();
    items.value = video;
    tabs.value = group;
    item_temp.value = video;
    // 将tabs转为select的items 以及将state和abbr赋值 清空其他属性
    tabs.value = tabs.value.map((item) => {
      return {
        state: item.Title,
        abbr: item.Id,
      };
    });
    // 在tabs前面添加一个全部选项
    tabs.value.unshift({
      state: "未分组",
      abbr: -2,
    });
    console.log(tabs.value)
    loading.value = false
  })

}
function getContent(item) {
  if (item.IsHideMain && item.IsHideGroup) {
    return "首页、分组隐藏";
  } else if (item.IsHideMain) {
    return "首页隐藏";
  } else if (item.IsHideGroup) {
    return "分组隐藏";
  } else {
    return "";
  }
}

function upload() {
  // 输入检查
  if (new_title.value === "") {
    alert("请输入视频标题")
    return
  }
  if (new_description.value === "") {
    alert("请输入视频简介")
    return
  }
  if (new_video.value === "") {
    alert("请选择视频文件")
    return
  }
  if (new_cover.value === "") {
    alert("请选择视频封面")
    return
  }
  uploading.value = true
// 先上传视频
  const formData = new FormData();
  formData.append("file", new_video.value[0]);
  axios.post("/api/upload/upload-video", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => {
    new_video_name.value = res.data.data.fileName
  });
  const formDataZ = new FormData();
  formDataZ.append("file", new_cover.value[0]);
  axios.post("/api/upload/upload-image", formDataZ, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => {
    new_cover_name.value = res.data.data.fileName
  });
}

function delete_video(item) {
  axios.post("/api/video/delete-video?id=" + item.Id).then(() => {
    load()
  });
}

function edit(item, isActive) {
  if (new_title.value === "") {
    alert("请输入视频标题")
    return
  }
  if (new_description.value === "") {
    alert("请输入视频简介")
    return
  }
  uploading.value = true;
  axios
    .post("/api/video/edit-video-detail", {
      title: new_title.value,
      description: new_description.value,
      id: item.Id,
      group_id: new_select.value,
      is_hide_main: is_hide_main.value,
      is_hide_group: is_hide_group.value,
    })
    .then((res) => {
      if (res.data.code === 0) {
        // 上传成功
        const toast = useToast();
        toast.success("修改成功", {position: POSITION.TOP_CENTER, timeout: 1000});
        load()
      } else {
        const toast = useToast();
        toast.error("修改失败", {position: POSITION.TOP_CENTER, timeout: 1000});
      }
      // 善后
      uploading.value = false;
      isActive.value = false;
      new_title.value = "";
      new_description.value = "";
      new_select.value = -2;
      is_hide_main.value = false;
      is_hide_group.value = false;
    });
}

watchEffect(() => {
  if (new_video_name.value !== "" && new_cover_name.value !== "") {
    axios
      .post("/api/video/add-video", {
        title: new_title.value,
        description: new_description.value,
        video_name: new_video_name.value,
        head_image: new_cover_name.value,
        group_id: new_select.value,
      })
      .then((res) => {
        if (res.data.code === 0) {
          // 上传成功
          // 善后
          new_video_dialog.value = false;
          new_title.value = "";
          new_description.value = "";
          new_video.value = "";
          new_cover.value = "";
          new_video_name.value = "";
          new_cover_name.value = "";
          new_select.value = -2;
          const toast = useToast();
          toast.success("发布成功", {position: POSITION.TOP_CENTER, timeout: 1000});
          load();
        } else {
          const toast = useToast();
          toast.error("发布失败," + res.data.message, {position: POSITION.TOP_CENTER, timeout: 1000});
        }
        uploading.value = false;
      });
  }
})
</script>

<template>
  <div className="flex flex-col m-5">
    <h2>视频管理</h2>
    <div class="mt-2">
      <v-dialog
        v-model="new_video_dialog"
        persistent
        width="auto"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            v-bind="props"
          >
            发布视频
          </v-btn>
        </template>
        <v-card class="lg:w-256 w-78">
          <v-card-title class="text-h5">
            发布视频
          </v-card-title>
          <v-card-text>
            <div class="flex flex-col">
              <v-text-field hint="请输入视频标题" label="视频标题" v-model="new_title"></v-text-field>
              <v-text-field hint="请输入视频简介" label="视频简介" v-model="new_description"></v-text-field>
              <v-select :items="tabs" item-title="state" item-value="abbr" v-model="new_select"/>
              <v-file-input label="视频文件" accept="video/mp4, video/flv" v-model="new_video"></v-file-input>
              <v-file-input label="封面" accept="image/png, image/jpeg, image/bmp" v-model="new_cover"></v-file-input>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              @click="new_video_dialog = false"
              :disabled="uploading"
            >
              取消
            </v-btn>
            <v-btn
              variant="text"
              :loading="uploading"
              @click="upload"
            >
              发布
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div class="flex flex-col">
      <div v-bind:key="item.Id" v-for="item in items" class="mt-2 overflow">
        <v-card class="mt-2 lg:h-32 w-full">
          <div class="lg:flex w-full h-full">
            <div class="flex lg:w-64 w-32 h-full">
              <v-img :src="'/resource/upload/images/' + item.HeadImage" class="rounded aspect-video" cover/>
            </div>
            <div class="flex flex-col justify-center ml-2 grow">
              <p class="text-h6">{{ item.Title }}
                <v-badge v-if="item.IsHideMain || item.IsHideGroup" :content="getContent(item)" color="info" class="ml-4"></v-badge>
              </p>

              <p class="text-body-2">{{ item.Description }}</p>
              <p class="text-body-2">{{ item.UploadDate.replace("Z", "").replace("T", " ") }}</p>

            </div>
            <div class="align-content-end flex lg:flex-col felx-auto items-center justify-center">
              <v-dialog
                width="auto"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    color="primary"
                    class="mr-2 mb-2"
                    v-bind="props"
                    variant="outlined"
                    @click='new_title = item.Title; new_description = item.Description; new_select = item.GroupId; detail_video_dialog = true; is_hide_main = item.IsHideMain;is_hide_group = item.IsHideGroup'
                  >
                    详情
                  </v-btn>
                </template>
                <template v-slot:default="{ isActive }">
                  <v-card class="lg:w-256 w-78">
                    <v-card-title class="text-h5">
                      视频详情
                    </v-card-title>
                    <v-card-text>
                      <div class="flex flex-col">
                        <v-text-field hint="请输入视频标题" label="视频标题" v-model="new_title"></v-text-field>
                        <v-text-field hint="请输入视频简介" label="视频简介" v-model="new_description"></v-text-field>
                        <v-select :items="tabs" item-title="state" item-value="abbr" v-model="new_select"/>
                        <div class="flex">
                          <v-switch color="primary" label="在首页中隐藏" v-model="is_hide_main"></v-switch>
                          <v-switch color="primary" label="在分组中隐藏" v-model="is_hide_group"></v-switch>
                        </div>
                      </div>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        variant="text"
                        :loading="uploading"
                        @click="edit(item, isActive)"
                      >
                        确定
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
              <v-btn variant="outlined" class="mb-2 mr-2" @click="delete_video(item)">删除</v-btn>
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
