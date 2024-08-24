<template>
  <v-app-bar :elevation="0" rounded class="border-b">
    <v-app-bar-nav-icon v-if="is_mob" @click="emit('update:is_show', !is_show)"></v-app-bar-nav-icon>
    <v-app-bar-title>
      <v-img src="@/assets/logo.png" width="256" transition="none" @click="router.push('/online-video')"/>
    </v-app-bar-title>
    <v-btn icon @click="check">
      <v-icon >mdi-account</v-icon>
    </v-btn>
  </v-app-bar>

  <v-dialog v-model="dialog" persistent width="480">
    <v-card>
      <v-card-title class="mt-4">
        <span class="text-h5">身份验证</span>
      </v-card-title>
      <v-col>
        <v-text-field v-model="username" label="用户名" required></v-text-field>
        <v-text-field v-model="password" label="密码" type="password" required @keyup.enter="login"></v-text-field>
      </v-col>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
          取消
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="login">
          登录
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { ref, computed } from 'vue'
import md5 from 'md5'
const emit = defineEmits(['update:is_show'])
const { mobile } = useDisplay()
const is_mob = computed(() => {
  return mobile.value
})
const dialog = ref(false)

const username = ref('')
const password = ref('')

function check() {
  if(window.location.pathname.includes("admin")) {
    localStorage.clear()
    router.push("/admin")
    return
  }
  // 判断sessionStorage中是否有账号密码
  if (localStorage.getItem("username") && localStorage.getItem("password")) {
    router.push("/admin")
    return
  }

  dialog.value = true
}
import axios from "axios";
import {useRouter} from "vue-router";
import {POSITION, useToast} from "vue-toastification";
const router = useRouter()
function login() {
  const data = {
    username: username.value,
    password: md5(password.value),
  };
  // 发送密码验证请求
  axios.post("/api/user/login-verify", data).then((res) => {
    if (res.data.data.isSuccess) {
      localStorage.setItem("username", username.value);
      localStorage.setItem("password", password.value);
      dialog.value = false;
      router.push("/admin")
    } else {
      const toast = useToast();
      toast.error("验证失败", {position: POSITION.TOP_CENTER});
    }
  });
}
</script>
