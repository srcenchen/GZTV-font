<script setup>
import {
  VDataTable,

} from "vuetify/labs/VDataTable";
import {onMounted, ref} from "vue";
import axios from "axios";
import {POSITION, useToast} from "vue-toastification";

const tabs = ref([])
const loading = ref(true)
const detail_group_dialog = ref(false)
const new_title = ref("")
const uploading = ref(false)

function load() {
  axios.get('/api/video/get-video-list').then((res) => {
    tabs.value = res.data.data.list.filter((item) => {
      return item.GroupId === -1;
    });
    // group.reverse();

    loading.value = false
  })
}

onMounted(() => {
  load()
})

const headers = [
  {
    title: '标题',
    align: 'start',
    sortable: false,
    key: 'Title',
  },
  {title: '操作', align: 'end', key: 'action'},
]

function delete_group(item,isActive) {
  uploading.value = true
  axios.post("/api/video/delete-video?id=" + item.Id).then(() => {
    load()
    const toast = useToast();
    toast.success("删除成功", {position: POSITION.TOP_CENTER, timeout: 1000});
    isActive.value = false
    uploading.value = false
  });
}


function submit() {
  // 输入检查
  if (new_title.value === "") {
    alert("请输入合辑标题")
    return
  }
  uploading.value = true
  axios
    .post("/api/video/add-video-group", {
      title: new_title.value,
      description: "description",
      video_name: "videoName",
      head_image: "imageName",
    }).then(() => {
    load()
    detail_group_dialog.value = false
    uploading.value = false
    const toast = useToast();
    toast.success("发布成功", {position: POSITION.TOP_CENTER, timeout: 1000});
  });
}
</script>

<template>
  <div class="flex flex-col m-5">
    <h2>合辑管理</h2>
    <div class="mt-2">
      <v-dialog
        v-model="detail_group_dialog"
        persistent
        width="auto"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            v-bind="props"
          >
            新增合辑
          </v-btn>
        </template>
        <v-card class="lg:w-256 w-78">
          <v-card-title class="text-h5">
            新增合辑
          </v-card-title>
          <v-card-text>
            <div class="flex flex-col">
              <v-text-field hint="请输入合辑标题" label="合辑标题" v-model="new_title"></v-text-field>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              @click="detail_group_dialog = false"
              :disabled="uploading"
            >
              取消
            </v-btn>
            <v-btn
              variant="text"
              :loading="uploading"
              @click="submit"
            >
              发布
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="mt-4 rounded">
      <v-data-table
        :headers="headers"
        :items="tabs"
        item-value="name"
        class="elevation-1"
      >
        <template v-slot:item.action="{item}">

          <v-dialog
            width="auto"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                color="black"
                class="mr-2 mb-2"
                v-bind="props"
                variant="text">
                <v-icon
                >
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card class="lg:w-256 w-78">
                <v-card-title class="text-h5">
                  删除确认
                </v-card-title>
                <v-card-text>
                  你确定要删除名为"{{ item.Title }}"的合辑吗？不过在此合辑内的视频不会丢失喔。此操作不可逆！
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
                    @click="delete_group(item, isActive)"
                  >
                    确定
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<style scoped>

</style>
