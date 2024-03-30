<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {POSITION, useToast} from "vue-toastification";

const tabs = ref([])
const loading = ref(true)
const detail_group_dialog = ref(false)
const new_title = ref("")
const description = ref("description")
const uploading = ref(false)
const group_data = ref([])

function load() {
  // 递归函数，将扁平结构的数组转换成具有层级关系的数组
  function convertToTree(data, parentId) {
    const result = [];
    data.forEach((item) => {
      if (item.ParentGroup === parentId) {
        const children = convertToTree(data, item.Id.toString());
        const newItem = {
          id: item.Id,
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
    console.log(group_data)
    loading.value = false;
  })

}

onMounted(() => {
  load()
})

const subDialogVisible = ref(false)
const delDialogVisible = ref(false)
const currentNodeID = ref('')

function delete_group(currentNodeID) {
  axios.post("/api/video/del-video-group?id=" + currentNodeID).then(() => {
    load()
    const toast = useToast();
    toast.success("删除成功", {position: POSITION.TOP_CENTER, timeout: 1000});
  });
}


function submit(parentGroup) {
  // 输入检查
  if (new_title.value === "") {
    alert("请输入合辑标题")
    return
  }
  uploading.value = true
  axios
    .post("/api/video/add-video-group", {
      title: new_title.value,
      description: description.value,
      parentGroup: parentGroup
    }).then(() => {
    load()
    detail_group_dialog.value = false
    uploading.value = false
    const toast = useToast();
    toast.success("发布成功", {position: POSITION.TOP_CENTER, timeout: 1000});
    new_title.value = ""
    description.value='description'
  });
}
</script>

<template>
  <div class="flex flex-col m-5">
    <h2>分类管理</h2>
    <div class="mt-2">
      <v-dialog
        v-model="detail_group_dialog"
        persistent
        width="auto"
      >
        <template v-slot:activator="{ props }">
          <el-button
            v-bind="props"
          >
            新增根分类
          </el-button>
        </template>
        <v-card class="lg:w-256 w-78">
          <v-card-title class="text-h5">
            新增根分类
          </v-card-title>
          <v-card-text>
            <div class="flex flex-col">
              <v-text-field hint="请输入分组标题" label="分组标题" v-model="new_title"></v-text-field>
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
              @click="submit(-1)"
            >
              发布
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div class="mt-4 rounded">

      <el-tree
        :data="group_data"
        accordion
        node-key="id"
        :expand-on-click-node="false"
      >
        <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <v-btn variant="text" @click="currentNodeID=data.id; subDialogVisible = true;description=''">添加子分类</v-btn>
            <v-btn variant="text" @click="currentNodeID=data.id;delDialogVisible=true">删除</v-btn>
          </span>
        </span>
        </template>
      </el-tree>
    </div>

    <el-dialog
      v-model="subDialogVisible"
      title="添加子分类"
      width="500"
    >
      <div class="flex flex-col">
        <v-text-field hint="请输入分组标题" label="分组标题" v-model="new_title"></v-text-field>
        <v-text-field hint="请输入分组简介" label="分组简介" v-model="description"></v-text-field>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="subDialogVisible = false;description='description'">取消</el-button>
          <el-button type="primary" @click="submit(currentNodeID);subDialogVisible = false">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="delDialogVisible"
      title="警告"
      width="500"
    >
      <span>删除分组，将会导致此分类下的所有子分类一并删除。<br>其下的所有视频将会归档为未分组状态！</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="delDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="delete_group(currentNodeID);delDialogVisible = false">
            确认删除
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
