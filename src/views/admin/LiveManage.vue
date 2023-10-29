<script setup>
import {onMounted, ref, watchEffect} from "vue";
import axios from "axios";
import {POSITION, useToast} from "vue-toastification";

const items = ref([])
const item_temp = ref([])
const loading = ref(true)
const new_live_dialog = ref(false)
const detail_live_dialog = ref(false)
const new_title = ref("")
const new_description = ref("")
const new_cover = ref("")
const new_cover_name = ref("")
const uploading = ref(false)
const rtmp_url = ref("")
const live_code = ref("")
const host_name = ref(window.location.hostname)
onMounted(() => {
  load()
})

function load() {
  axios.get('/api/live/get-live-list').then((res) => {
    const live = res.data.data.list.filter((item) => {
      return item.GroupId !== -1;
    });
    live.reverse();
    // group.reverse();
    items.value = live;
    item_temp.value = live;
    loading.value = false
  })

}

function upload() {
  // 输入检查
  if (new_title.value === "") {
    alert("请输入直播标题")
    return
  }
  if (new_description.value === "") {
    alert("请输入直播简介")
    return
  }
  if (new_cover.value === "") {
    alert("请选择直播封面")
    return
  }
  uploading.value = true
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

function delete_live(item) {
  axios.post("/api/live/delete-live?id=" + item.Id).then(() => {
    const toast = useToast();
    toast.success("删除成功", {position: POSITION.TOP_CENTER});
    load()
  });
}

watchEffect(() => {
  if(new_cover_name.value !== ""){
    axios
      .post("/api/live/add-live", {
        title: new_title.value,
        description: new_description.value,
        head_image: new_cover_name.value,
      })
      .then((res) => {
        if (res.data.code === 0) {
          // 上传成功
          // 善后
          new_live_dialog.value = false;
          new_title.value = "";
          new_description.value = "";
          new_cover.value = "";
          new_cover_name.value = "";
          const toast = useToast();
          toast.success("发布成功", {position: POSITION.TOP_CENTER});
          load();
        } else {
          const toast = useToast();
          toast.error("发布失败", {position: POSITION.TOP_CENTER});
        }
        uploading.value = false;
      });
  }
})
</script>

<template>
  <div className="flex flex-col m-5">
    <h2>直播管理</h2>
    <div class="mt-2">
      <v-dialog
        v-model="new_live_dialog"
        persistent
        width="auto"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"

            v-bind="props"
          >
            发起直播
          </v-btn>
        </template>
        <v-card class="lg:w-256 w-78">
          <v-card-title class="text-h5">
            发起直播
          </v-card-title>
          <v-card-text>
            <div class="flex flex-col">
              <v-text-field hint="请输入直播标题" label="直播标题" v-model="new_title"></v-text-field>
              <v-text-field hint="请输入直播简介" label="直播简介" v-model="new_description"></v-text-field>
              <v-file-input label="封面" accept="image/png, image/jpeg, image/bmp" v-model="new_cover"></v-file-input>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              @click="new_live_dialog = false"
              :disabled="uploading"
            >
              取消
            </v-btn>
            <v-btn
              variant="text"
              :loading="uploading"
              @click="upload"
            >
              发起
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
              <v-img :src="'/resource/upload/images/' + item.HeadImage" class="rounded aspect-live" cover/>
            </div>
            <div class="flex flex-col justify-center ml-2 grow">
              <div class="flex items-center">
                <p class="text-h6">{{ item.Title }}</p>
                <v-badge v-if="item.LiveState" content="直播中" color="success" class="ml-4"></v-badge>
                <v-badge v-else content="无信号" color="error" class="ml-4"></v-badge>
              </div>

              <p class="text-body-2">{{ item.Description }}</p>
              <p class="text-body-2">{{ item.SubmitDate.replace("Z", "").replace("T", " ") }}</p>
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
                    @click='rtmp_url = "rtmp://" + host_name + ":1936/gztv/";live_code = item.StreamName;detail_live_dialog = true'
                  >
                    详情
                  </v-btn>
                </template>
                <template v-slot:default="{ isActive }">
                  <v-card class="lg:w-256 w-78">
                    <v-card-title class="text-h5">
                      直播详情
                    </v-card-title>
                    <v-card-text>
                      <div class="flex flex-col">
                        <v-text-field readonly  label="推流地址" v-model="rtmp_url"></v-text-field>
                        <v-text-field readonly="" label="推流码" v-model="live_code"></v-text-field>
                      </div>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        variant="text"
                        @click="isActive.value = false"
                      >
                        确定
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </template>

              </v-dialog>
              <v-btn variant="outlined" class="mb-2 mr-2" @click="delete_live(item)">删除</v-btn>
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
