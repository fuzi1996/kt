<template>
  <div class="pod-list-container">
    <el-row>
      <el-col :span="12">
        <el-input v-model="fileterValue"></el-input>
      </el-col>
      <el-col :span="12">
        <el-button @click="listPod" class="first-but">刷新</el-button>
      </el-col>
    </el-row>
    <el-divider class="search-divider" />
    <el-table id="pod-table" :data="podList" v-loading="loading" :height="height">
      <el-table-column label="Date" width="auto" min-width="25%">
        <template #default="scope">
          <span>{{ scope.row.creationTimestamp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" width="auto" min-width="45%" show-overflow-tooltip>
        <template #default="scope">
          <el-tag>
            {{ scope.row.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Operations" width="auto" min-width="30%">
        <template #default="scope">
          <el-button size="small" :icon="scope.row.copying?'CircleCheckFilled':'CopyDocument'" @click="handleCopyIconClick(scope.row)">
            复制
          </el-button>
          <el-button size="small" @click="openPodLog(scope.row)">
            Log
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { ipcRenderer } from 'electron'
import { IpcService } from 'frontend/utils/IpcService'
import { K8S_EVENT,CLIPBOARD_EVENT,WINDOW_EVENT } from 'shared/Events'
import { LOG_MENU_ROUTE } from 'shared/Menu'
import { ElMessage } from 'element-plus'
import { V1PodList,V1Pod } from "@kubernetes/client-node";
import { nextTick, onMounted, ref } from 'vue';

interface Pod {
  value: V1Pod
  name?: string,
  containerName: string,
  creationTimestamp: string,
  copying: boolean,
  namespace: string
}

const ipcService = new IpcService()
const fileterValue = ref<string>('')
const allPods: Pod[] = []
const podList = ref<Pod[]>([])
const loading = ref<boolean>(false)
const height = ref<number>(200)
const tablePadding = 30

onMounted(()=>{
  getAutoHeight()
  window.onresize = function() {
    getAutoHeight()
  }
  listPod()
})

const filtePod = () => {
  if(fileterValue.value){
    podList.value = allPods.filter(pod => {
      if(pod.name){
        return pod.name.indexOf(fileterValue.value) > -1;
      }else{
        return false
      }
    })
  }else{
    podList.value = allPods
  }
}

const openPodLog = (row: Pod) => {
  const route = {
    route: LOG_MENU_ROUTE,
    param: {
      podName: row.name,
      containerName: row.containerName,
      namespace: row.namespace
    }
  }
  ipcRenderer.invoke(WINDOW_EVENT.OPEN, route)
}

const handleCopyIconClick = (row: Pod) => {
  row.copying = true
  ipcRenderer.invoke(CLIPBOARD_EVENT.COPY, row.name).then(()=>{
    ElMessage.success('复制成功')
  }).finally(()=>{
    row.copying = false
  })
}

const formCreationTimestamp = (date?: Date): string => {
  if(date){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }else{
    return ''
  }
}

const getAutoHeight = () => {
  const el = document.getElementById("pod-table")
  if(el){
    const elParent = (el as HTMLElement).parentNode as HTMLElement
    if(elParent){
      nextTick(()=>{
        height.value = elParent.clientHeight - tablePadding
      })
    }
  }
  
  // pt = this.getStyle(elParent, "paddingTop"),
  // pb = this.getStyle(elParent, "paddingBottom");
  // this.$nextTick(() => {
  //   this.height = elParent.clientHeight - (pt + pb) + "px";
  // });
}

// const getStyle = (obj, attr) => {
//       // 兼容IE浏览器
//       let result = obj.currentStyle
//         ? obj.currentStyle[attr].replace("px", "")
//         : document.defaultView
//             .getComputedStyle(obj, null)[attr].replace("px", "");
//       return Number(result);
//     }

const listPod = () => {
  allPods.length = 0
  podList.value.length = 0
  loading.value = true
  ipcService.send<any>(K8S_EVENT.LIST_POD).then(res => {
    const response:V1PodList = res as V1PodList
    response.items.forEach(item => {
      if(item.metadata && item.spec){
        const pod: Pod = {
          value: item,
          name: item.metadata.name,
          containerName: item.spec.containers[0].name,
          creationTimestamp: formCreationTimestamp(item.metadata?.creationTimestamp),
          copying: false,
          namespace: item.metadata.namespace || ''
        }
        allPods.push(pod)
      }
    })
    filtePod()
  }).catch(err => {
    ElMessage.error(`获取Pod列表失败,${err.message}`)
  }).finally(() =>{
    loading.value = false
  })
}

</script>
<style scoped>
.first-but{
  margin-left: 12px;
}
.search-divider{
  margin: 5px 0;
}
.pod-list-container{
  height: 100%;
}
</style>