<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-input v-model="fileterValue"></el-input>
      </el-col>
      <el-col :span="12">
        <el-button @click="listPod" class="first-but">刷新</el-button>
      </el-col>
    </el-row>
    <el-divider />
    <el-table :data="podList" style="width: 100%" v-loading="loading">
      <el-table-column label="Date" width="auto" min-width="25%">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon><timer /></el-icon>
            <span style="margin-left: 10px">{{ scope.row.creationTimestamp }}</span>
          </div>
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
import { onMounted, ref } from 'vue';

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
onMounted(()=>{
  listPod()
})

function filtePod(){
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

function openPodLog(row: Pod){
  const route = {
    route: LOG_MENU_ROUTE,
    param: {
      podName: row.name,
      containerName: row.containerName,
      namespace: row.namespace
    }
  }
  ipcRenderer.invoke(WINDOW_EVENT.OPEN, route).then(()=>{
    ElMessage.success('打开成功')
  })
}

function handleCopyIconClick(row: Pod){
  row.copying = true
  ipcRenderer.invoke(CLIPBOARD_EVENT.COPY, row.name).then(()=>{
    ElMessage.success('复制成功')
  }).finally(()=>{
    row.copying = false
  })
}

function formCreationTimestamp(date?: Date): string{
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
</style>