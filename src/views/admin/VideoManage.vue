<script setup>
import {onMounted, ref, watch, watchEffect} from "vue";
import axios from "axios";
import {POSITION, useToast} from "vue-toastification";
import {Search} from "@element-plus/icons-vue";

const tab_item = ref([])
const tabs = ref([])
const items = ref([])
const loading = ref(true)
const view_select_value = ref(0)
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
const progress = ref(0)
const submit_video_dialog = ref(false)
const group_data_view = ref()
const refresh_group = ref(false)
onMounted(() => {
  // 递归函数，将扁平结构的数组转换成具有层级关系的数组
  function convertToTree(data, parentId) {
    const result = [];
    data.forEach((item) => {
      if (item.ParentGroup === parentId) {
        const children = convertToTree(data, item.Id.toString());
        const newItem = {
          value: item.Id,
          label: item.Title,
          parentGroup: item.ParentGroup
        };
        if (children.length > 0) {
          newItem.children = children;
        }
        result.push(newItem);
      }
    });
    return result;
  }
  axios.get('/api/video/get-video-group-list').then((res) => {
    // 将res.data.data.list 中GroupId强制转为Int类型
    res.data.data.list.forEach((item) => {
      item.GroupId = parseInt(item.GroupId)
    })
    tabs.value = res.data.data.list

    // 将扁平结构的数组转换成具有层级关系的数组
    group_data.value = convertToTree(res.data.data.list, "-1");
    group_data.value.unshift(
      {
        value: -2,
        label: "未分组"
      }
    )
    group_data_view.value = Array.from(group_data.value);
    group_data_view.value.unshift(
      {
        value: -3,
        label: "全部视频"
      }
    )
    console.log(group_data)
    loading.value = false;
  })
  load()
  view_select_value.value = -3

})
const group_data = ref([])
const m_item = ref()
const item_temp = ref()

const search_value = ref('')

function load() {
  axios.get('/api/video/get-video-list').then((res) => {
    // 将res.data.data.list 中GroupId强制转为Int类型
    res.data.data.list.forEach((item) => {
      item.GroupId = parseInt(item.GroupId)
    })
    const video = res.data.data.list.filter((item) => {
      return item.GroupId !== -1;
    });
    video.reverse();
    item_temp.value = video
    tab_item.value = items.value

    // group.reverse();
    items.value = video;
    loading.value = false
    refresh_group.value = !refresh_group.value
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
    onUploadProgress: function (progressEvent) {
      // 计算上传进度
      progress.value = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
    },
  }).then((res) => {
    new_video_name.value = res.data.data.fileName;
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

function delete_video(item, isActive) {
  uploading.value = true;
  axios.post("/api/video/delete-video?id=" + item.Id).then(() => {
    load()
    isActive.value = false;
    const toast = useToast();
    uploading.value = false;
    toast.success("删除成功", {position: POSITION.TOP_CENTER, timeout: 1000});
  });
}

watch(search_value, (newValue, oldValue) => {
  items.value = tab_item.value.filter(item => {
    return item.Title.includes(newValue) || item.Description.includes(newValue);
  });
});

// 修改信息
function edit(item) {
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
      detail_video_dialog.value = false;
      new_title.value = "";
      new_description.value = "";
      new_select.value = -2;
      is_hide_main.value = false;
      is_hide_group.value = false;
    });
}

function getGroup(item) {
  try {
    if (item.GroupId === -2) {
      return "未分组"
    } else {
      return tabs.value.find((tab) => {
        return tab.Id === item.GroupId
      }).Title
    }
  } catch (e) {
    return '子分类'
  }
}

// 监听
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
          submit_video_dialog.value = false;
          new_title.value = "";
          new_description.value = "";
          new_video.value = "";
          new_cover.value = "";
          new_video_name.value = "";
          new_cover_name.value = "";
          new_select.value = -2;
          const toast = useToast();
          progress.value = 0;
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

watch([view_select_value,refresh_group], (newValue, oldValue) => {
  // console.log(group_id.value)
  if (newValue[0] === -3) {
    items.value = item_temp.value
  } else {
    items.value = item_temp.value.filter((item) => {
      return item.GroupId === newValue[0]
    });
  }
  tab_item.value = items.value
})

function submit_button() {
  submit_video_dialog.value = true;
  if (view_select_value.value !== -3) {
    new_select.value = view_select_value.value
  }
  console.log(view_select_value.value)
}

</script>

<template>
  <div className="flex flex-col m-5">
    <div class="flex mb-2">
      <h2>视频管理</h2>
      <el-input style="width: 220px" class="ml-4" placeholder="在当前页搜索" :prefix-icon="Search"
                v-model="search_value"></el-input>
    </div>

    <el-tree-select default-expand-all :data="group_data_view" v-model="view_select_value" check-strictly :render-after-expand="false"/>
    <div class="mt-2">
      <el-button
        @click="submit_button"
      >
        发布视频
      </el-button>
    </div>

    <div class="flex flex-col mt-2">
      <div class="flex flex-wrap">
        <div v-for="item in items" :key="item.id" class="2xl:w-1/5 xl:w-1/4 lg:w-1/3 md:w-1/3 w-full pr-4 coil mb-2">
          <v-card>
            <v-img :src="'/resource/upload/images/' + item.HeadImage " class="rounded w-full aspect-video" cover
                   v-if="!item.ParentGroup"/>
            <v-img src="@/assets/file_logo.png" class="rounded w-full aspect-video" v-else/>
            <div class="flex items-center mt-2">
              <div class="text-subtitle-2 ml-2 mr-2 truncate">{{ item.Title }}</div>
              <v-badge v-if="item.IsHideMain || item.IsHideGroup" :content="getContent(item)" color="info"
                       class="ml-2"></v-badge>
            </div>
            <div class="text-subtitle-2 font-weight-light ml-2 mr-2 truncate">{{ item.Description }}</div>
            <div class="text-subtitle-2 font-weight-light ml-2 mb-2 mr-2 truncate">
              {{ item.UploadDate.replace("Z", "").replace("T", " ") }}
            </div>
            <div class="flex items-center mt-2 mb-5 ml-4 w-100">
              <v-badge :content="getGroup(item)" color="success"></v-badge>

            </div>
            <div class="flex items-center justify-center">
              <div class="align-content-end flex items-center justify-center">
                <v-btn
                  color="primary"
                  class="mr-2 mb-2"
                  variant="flat"
                  @click='m_item = item; new_title = item.Title; new_description = item.Description; new_select = item.GroupId; detail_video_dialog = true; is_hide_main = item.IsHideMain;is_hide_group = item.IsHideGroup'
                >
                  详情
                </v-btn>
                <v-dialog
                  width="auto"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      color="primary"
                      class="mr-2 mb-2"
                      v-bind="props"
                      variant="outlined">
                      删除
                    </v-btn>
                  </template>
                  <template v-slot:default="{ isActive }">
                    <v-card class="lg:w-256 w-78">
                      <v-card-title class="text-h5">
                        删除确认
                      </v-card-title>
                      <v-card-text>
                        你确定要删除名为"{{ item.Title }}"的视频吗？此操作及其危险且不可逆！
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          variant="flat"
                          @click="isActive.value = false"
                        >
                          取消
                        </v-btn>
                        <v-btn
                          variant="text"
                          :loading="uploading"
                          @click="delete_video(item, isActive)"
                        >
                          确定
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </v-dialog>
              </div>
            </div>
          </v-card>
        </div>
      </div>
    </div>


    <el-dialog
      v-model="submit_video_dialog"
      title="视频详情"
      :close-on-click-modal="false"
    >
      <div class="flex flex-col">
        <div class="flex flex-col">
          <v-text-field hint="请输入视频标题" label="视频标题" v-model="new_title"></v-text-field>
          <v-text-field hint="请输入视频简介" label="视频简介" v-model="new_description"></v-text-field>
          <v-file-input label="视频文件" accept="video/mp4, video/flv" v-model="new_video"></v-file-input>
          <v-file-input label="封面" accept="image/png, image/jpeg, image/bmp" v-model="new_cover"></v-file-input>
          <el-tree-select :data="group_data" v-model="new_select" check-strictly :render-after-expand="false"/>
          <div class="flex flex-col" v-if="uploading">
            <v-progress-linear color="primary" max="100" :model-value="progress"></v-progress-linear>
            <p class="text-h6">上传进度: {{ progress }}%</p>
          </div>

        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <v-btn
            variant="text"
            @click="submit_video_dialog = false"
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
        </div>
      </template>
    </el-dialog>


    <el-dialog
      v-model="detail_video_dialog"
      title="视频详情"
    >
      <div class="flex flex-col">
        <div class="flex flex-col">
          <v-text-field hint="请输入视频标题" label="视频标题" v-model="new_title"></v-text-field>
          <v-text-field hint="请输入视频简介" label="视频简介" v-model="new_description"></v-text-field>
          <!--                        <v-select :items="tabs" item-title="state" item-value="abbr" v-model="new_select"/>-->
          <el-tree-select :data="group_data" v-model="new_select" check-strictly :render-after-expand="false"/>
          <div class="flex">
            <v-switch color="primary" label="在首页中隐藏" v-model="is_hide_main"></v-switch>
            <v-switch color="primary" label="在分组中隐藏" v-model="is_hide_group"></v-switch>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="edit(m_item)" :loading="uploading">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<style scoped>

</style>
