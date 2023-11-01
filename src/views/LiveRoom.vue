<script></script>
<template>
  <div class="coil ml-4 mt-4">
    <div class="text-h5 font-weight-bold">直播大厅</div>
    <div class="flex flex-wrap mt-4" v-if="items.length !== 0">
      <div v-for="item in items" :key="item.id" class="2xl:w-1/5 xl:w-1/4 lg:w-1/3 md:w-1/3 w-full pr-4 coil mb-2">
        <v-card @click="click_item(item)">
          <v-img :src="'/resource/upload/images/' + item.HeadImage" class="rounded w-full aspect-video" cover/>
          <div class="flex items-center mt-2">
            <div class="text-subtitle-2 ml-2 mr-2 truncate">{{ item.Title }}</div>
            <v-badge v-if="item.LiveState" content="直播中" color="success" class="ml-4"></v-badge>
            <v-badge v-else content="无信号" color="error" class="ml-4"></v-badge>
          </div>
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
import {ref, onMounted} from 'vue'
import axios from 'axios'
import router from "@/router";

const items = ref([])
const loading = ref(true)
onMounted(() => {
  axios.get('/api/live/get-live-list').then((res) => {
    items.value = res.data.data.list
    loading.value = false
  })
})
function click_item(item) {
  router.push("/live-player/?id=" + item.Id)
}
</script>
