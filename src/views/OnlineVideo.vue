<script></script>
<template>
  <div class="coil ml-4 mt-4">
    <div class="text-h5 font-weight-bold">在线视频</div>
    <v-tabs v-model="group_id" class="mb-2">
      <v-tab key=-2 class="text-subtitle-2">首页</v-tab>
      <v-tab v-for="tab in tabs" :key="tab.Id" class="text-subtitle-2">{{ tab.Title }}</v-tab>
    </v-tabs>
    <div class="flex flex-wrap" v-if="items.length !== 0">
      <div v-for="item in items" :key="item.id" class="2xl:w-1/5 xl:w-1/4 lg:w-1/3 md:w-1/3 w-full pr-4 coil mb-2">
        <v-card @click="click_item(item)">
          <v-img :src="'/resource/upload/images/' + item.HeadImage" class="rounded w-full aspect-video" cover/>
          <div class="text-subtitle-2 ml-2 mr-2 truncate mt-2">{{ item.Title }}</div>
          <div class="text-subtitle-2 font-weight-light ml-2 mb-2 mr-2 truncate">{{ item.Description }}</div>
        </v-card>
      </div>
    </div>
    <div v-else-if="!loading" class="flex flex-col justify-center items-center w-full">
      <v-icon size="x-large">mdi-inbox-outline</v-icon>
      <div class="text-h6 font-weight-bold mt-2">空空如也</div>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted, watchEffect} from 'vue'
import axios from 'axios'
import {useRouter} from "vue-router";

const tabs = ref([])
const items = ref([])
const item_temp = ref([])
const loading = ref(true)
onMounted(() => {
  axios.get('/api/video/get-video-list').then((res) => {
    // res.data 反向排序
    // 注意 这里groupid -1 就代表这不是个视频 也就是分组

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
    loading.value = false
  })
})
const router = useRouter()

function click_item(item) {
  console.log(item.Id)
  router.push("/video-player/?id=" + item.Id)
}

const group_id = ref(-2)

watchEffect(() => {
  console.log(group_id.value)
  if (group_id.value === 0) {
    items.value = item_temp.value.filter((item) => {
      return item.GroupId !== -1 && item.IsHideMain !== true;
    });
  } else {
    items.value = item_temp.value.filter((item) => {
      return item.GroupId === tabs.value[group_id.value - 1].Id && item.IsHideGroup !== true;
    });
  }
})
</script>
