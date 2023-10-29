<script setup>

import AppBar from "@/components/AppBar.vue";
import {computed, ref, watchEffect} from "vue";
import {useDisplay} from "vuetify";
import axios from "axios";
import FooterBar from "@/components/FooterBar.vue";
import mpegts from "mpegts.js";
import Hls from "hls.js";

const is_show = ref(false)
const {mobile} = useDisplay()
const mob = computed(() => {
  return mobile.value
})
// 获取parms
const params = new URLSearchParams(window.location.search);
const videoID = params.get("id");
const liveDetail = ref({
  Id: 0,
  Title: "Loading...",
  Description: "Loading...",
  SubmitDate: "Loading...",
})
const loadSuccess = ref(false)
const pullMethod = ref("HLS-M3U8")
const urlHls = ref("")

function getLiveDetail(id) {
  axios.get("/api/live/get-live?id=" + id).then((res) => {
    document.title = res.data.data.live.Title;
    liveDetail.value = res.data.data.live;
    pullMethod.value = res.data.data.pull;
    loadSuccess.value = true
  });
}

getLiveDetail(videoID)

function isIOS() {
  return navigator.userAgent.match(/(iPhone|iPod|ios)/i);
}

function isSSL() {
  return window.location.protocol === "https:";
}


function load() {// 载入
// 使用hls.js播放
// 判断是否为iOS
  const playUrlHls = () => {
    // 获取hostName
    const hostName = window.location.hostname;
    const port = isSSL() ? "4433" : "6021";
    return `//${hostName}:${port}/hls/${liveDetail.value.StreamName}.m3u8`;
  };

  const playUrlFlv = () => {
    // 获取hostName
    const hostName = window.location.hostname;
    const port = isSSL() ? "4433" : "6021";
    return `//${hostName}:${port}/live/${liveDetail.value.StreamName}.flv`;
  };

  if (!isIOS()) {
    const video = document.getElementById("livePlayer")
    // 判断拉流方式
    if (pullMethod.value === "HLS-M3U8") {
      // 使用hls.js播放
      let hls = new Hls();
      hls.attachMedia(video);
      hls.loadSource(playUrlHls());
    } else if (pullMethod.value === "RTMP-FLV") {
      // 使用mpegts.js播放
      let player = mpegts.createPlayer({
        type: "flv", // could also be mpegts, m2ts, flv
        isLive: true,
        url: playUrlFlv(),
      });
      player.attachMediaElement(video);
      player.load();
      player.play();
    }
  } else {
    // iOS 使用原生播放器 HLS
    urlHls.value = playUrlHls()
  }

// 判断是否有信号
  if (liveDetail.value.LiveState !== true && loadSuccess.value) {
    alert("当前直播未开播");
    window.location.href = "/live-room";
  }
}

watchEffect(() => {
  load()
})
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
        <h2 class="mb-4" style="text-align: center">{{ liveDetail.Title }}</h2>
        <div class="w-full flex flex-col lg:flex-row">
          <video
            id="livePlayer"
            controls
            class="lg:w-3/4 w-full rounded"
            autoPlay
            :src="urlHls"
          ></video>
          <v-card
            class="lg:w-1/4 lg:ml-4 lg:mt-0 ml-2 mr-2"
          >
            <div class="flex flex-col flex-1 m-2">
              <h3 class="lg:ml-2 lg:mt-2">直播简介</h3>
              <p class="lg:m-2 m-1">{{ liveDetail.Description }}</p>
              <h3 class="lg:ml-2 lg:mt-2">发布日期</h3>
              <p class="lg:m-2 m-1">{{ liveDetail.SubmitDate.replace("Z", "").replace("T", " ") }}</p>
              <p className="lg:ml-2 mt-2">直播卡顿?切换另一种拉流方式试试!</p>
              <v-tabs
                fixed-tabs
                v-model="pullMethod"
              >
                <v-tab value="HLS-M3U8">
                  HLS-M3U8
                </v-tab>
                <v-tab value="RTMP-FLV">
                  RTMP-FLV
                </v-tab>
              </v-tabs>
            </div>
          </v-card>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>

</style>
