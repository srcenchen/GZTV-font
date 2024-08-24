<script setup>
import {ref, onMounted, watchEffect} from 'vue'
import md5 from 'md5'

const radios = ref('')
const version = ref('v0.0.0')
const new_password = ref('')
const username = ref(localStorage.getItem("username"))
const notice = ref("")
const title = ref("")
const footer = ref("")
// 获取远端数据
import axios from 'axios'
import {POSITION, useToast} from "vue-toastification";

onMounted(() => {
  axios.get('/api/setting/get-pull-setting').then(res => {
    radios.value = res.data.data.pull_setting
  })
  axios.get('/api/setting/get-version').then(res => {
    version.value = res.data.data.version
  })
  axios.get('/api/setting/get-notice').then(res => {
    notice.value = res.data.data.notice
  })
  axios.get('/api/setting/get-title').then(res => {
    title.value = res.data.data.Title
  })
  axios.get('/api/setting/get-footer').then(res => {
    footer.value = res.data.data.Footer
  })
})
watchEffect(() => {
  axios.get('/api/setting/set-pull-setting?pull_setting=' + radios.value).then(res => {

  })

})

function change_password() {
  if (new_password.value === "") {
    alert("请输入新密码")
    return
  }
  // 将密码md5
  const passwordMd5 = md5(new_password.value);

  axios
    .get("/api/user/change-password?username=" + username.value + "&new_password=" + passwordMd5)
    .then((res) => {
      if (res.data.code === 0) {
        const toast = useToast();
        toast.success("修改成功", {position: POSITION.TOP_CENTER, timeout: 1000});
        localStorage.clear();
        window.location.href = "/";
      } else {
        const toast = useToast();
        toast.error("修改失败", {position: POSITION.TOP_CENTER, timeout: 1000});
      }
    });
}

function submit_notice() {
  if (checkAdmin())
    axios.get('/api/setting/set-notice?notice=' + notice.value).then(res => {
      const toast = useToast();
      if (res.data.code === 0) {
        // Use it!
        toast.success("设置成功", {position: POSITION.TOP_CENTER, timeout: 1000});
      } else {
        toast.error("操作失败", {position: POSITION.TOP_CENTER, timeout: 1000});
      }
    })
}

function submit_title() {
  if (checkAdmin())
    axios.get('/api/setting/set-title?title=' + title.value).then(res => {
      const toast = useToast();
      if (res.data.code === 0) {
        // Use it!
        toast.success("设置成功", {position: POSITION.TOP_CENTER, timeout: 1000});
      } else {
        toast.error("操作失败", {position: POSITION.TOP_CENTER, timeout: 1000});
      }
    })
}

function submit_footer() {
  if (checkAdmin())
    axios.get('/api/setting/set-footer?footer=' + footer.value).then(res => {
      const toast = useToast();
      if (res.data.code === 0) {
        // Use it!
        toast.success("设置成功", {position: POSITION.TOP_CENTER, timeout: 1000});
      } else {
        toast.error("操作失败", {position: POSITION.TOP_CENTER, timeout: 1000});
      }
    })
}

function checkAdmin() {
  if (localStorage.getItem("username") === "sanenchen" || localStorage.getItem("username") === "admin") {
    return true
  }
  const toast = useToast();
  toast.error("操作失败，非admin账户，无权限！", {position: POSITION.TOP_CENTER, timeout: 1000});
  return false
}
</script>

<template>
  <div className="flex flex-col m-5">
    <h2>系统设置</h2>
    <h4 class="mt-3 mb-2">网站标题</h4>
    <v-text-field
      v-model="title"
      label="网站标题"
      outlined
      class="lg:w-1/2"
    ></v-text-field>
    <div>
      <v-btn variant="outlined" @click="submit_title">保存标题</v-btn>
    </div>
    <h4 class="mt-3 mb-2">网站页脚</h4>
    <v-text-field
      v-model="footer"
      label="网站页脚"
      outlined
      class="lg:w-1/2"
    ></v-text-field>
    <div>
      <v-btn variant="outlined" @click="submit_footer">保存页脚</v-btn>
    </div>
    <h4 class="mt-3">公告管理</h4>
    <div class="flex flex-col mt-2">
      <v-textarea v-model="notice" variant="outlined"></v-textarea>
      <div>
        <v-btn variant="outlined" @click="submit_notice">保存</v-btn>
      </div>
    </div>
    <h4 class="mt-3">密码修改</h4>
    <v-text-field
      label="用户名"
      disabled=""
      outlined
      class="lg:w-1/2"
      v-model="username"
    ></v-text-field>
    <v-text-field
      v-model="new_password"
      label="新密码"
      type="password"
      outlined
      class="lg:w-1/2"
    ></v-text-field>
    <div>
      <v-btn variant="outlined" @click="change_password">保存密码</v-btn>
    </div>

    <h4 class="mt-3">默认拉流协议</h4>
    <p className="ml-2 mr-2 mb-1 mt-2">
      RTMP-FLV的延迟较小,一般在5秒以内,但是首次加载时间较长,大约5-7秒左右
    </p>
    <p className="ml-2 mr-2 mb-1">
      HLS-M3U8的延迟较大,一般在20-30秒左右,但基本可以达到秒开效果
    </p>
    <p className="ml-2 mr-1 mb-1">
      若不是对延迟有特别大的要求,优先考虑HLS-M3U8,对于内网环境,可以考虑RTMP-FLV
    </p>
    <p className="ml-2 mr-1">
      由于iOS端不支持RTMP-FLV 在iOS端将强制使用HLS-M3U8 (此协议是苹果提出的)
    </p>
    <v-radio-group v-model="radios" inline class="mb-0">
      <v-radio label="HLS-M3U8" value="HLS-M3U8"></v-radio>
      <v-radio label="RTMP-FLV" value="RTMP-FLV"></v-radio>
    </v-radio-group>
    <h4 class="mt-3">版本信息</h4>
    <p className="ml-2 mr-2 mb-1 mt-2">
      当前版本: {{ version }}
    </p>
    <h4 class="mt-2">项目源码仓库</h4>
    <div class="mt-2">
      <v-btn variant="outlined" onclick=' window.open("https://github.com/srcenchen/eGZ-GZTV/");' class="w-30 mr-2">
        Github
      </v-btn>
      <v-btn variant="outlined" onclick='window.open("https://github.com/srcenchen/eGZ-GZTV/releases/latest/");'
             class="w-30">最新发行版
      </v-btn>
    </div>

  </div>
</template>

<style scoped>

</style>
