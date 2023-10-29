<script setup>

import AppBar from "@/components/AppBar.vue";
import {computed, ref} from "vue";
import {useDisplay} from "vuetify";
import axios from "axios";
import FooterBar from "@/components/FooterBar.vue";
import mpegts from "mpegts.js";

const is_show = ref(false)
const {mobile} = useDisplay()
const mob = computed(() => {
  return mobile.value
})
// 获取parms
const params = new URLSearchParams(window.location.search);
const videoID = params.get("id");
const videoDetail = ref({
  Id: 0,
  Title: "Loading...",
  Description: "Loading...",
  UploadDate: "Loading...",
})

function getVideoDetail(id) {
  axios.get("/api/video/get-video?id=" + id).then((res) => {
    document.title = res.data.data.video.Title;
    videoDetail.value = res.data.data.video;
  });
}

getVideoDetail(videoID)
</script>

<template>
  <v-app>
    <AppBar v-model:is_show="is_show"/>
    <FooterBar/>
    <v-navigation-drawer v-model="is_show" :location="mob ? 'top' : 'left'">
      <v-list density="compact" nav>
        <v-list-item color="primary" prepend-icon="mdi-video" title="在线视频"
                     value="online-videos" to="/online-video" link></v-list-item>
        <v-list-item color="primary" prepend-icon="mdi-video-input-antenna" title="直播大厅"
                     value="live-room" to="/live-room" link></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <div class="flex flex-col items-center md:items-start md:ml-24 md:mr-24 mt-4">
        <h2 class="mb-4" style="text-align: center">{{ videoDetail.Title }}</h2>
        <div class="w-full flex flex-col lg:flex-row">
          <video
            id="videoPlayer"
            controls
            class="lg:w-3/4 w-full rounded"
            autoPlay
            :src="'/resource/upload/videos/' + videoDetail.VideoName"
          ></video>
          <v-card
            class="lg:w-1/4 lg:ml-4 lg:mt-0 ml-2 mr-2"
          >
            <div class="flex flex-col flex-1 m-2">
              <h3 class="lg:ml-2 lg:mt-2">视频简介</h3>
              <p class="lg:m-2 m-1">{{ videoDetail.Description }}</p>
              <h3 class="lg:ml-2 lg:mt-2">发布日期</h3>
              <p class="lg:m-2 m-1">{{ videoDetail.UploadDate.replace("Z", "").replace("T", " ") }}</p>
            </div>
          </v-card>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>

</style>
