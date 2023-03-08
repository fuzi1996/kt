<template>
  <div>
    <el-input v-model="key" label="Key"></el-input>
    <el-input v-model="value" label="Value"></el-input>
    <el-button @click="handleSave">存值</el-button>
    <el-button @click="handleGet">取值</el-button>
    <el-button @click="handleGetSystemInfo">系统信息</el-button>

    <el-dialog
      v-model="isDialogShow"
      title="系统信息"
      width="60%"
    >
      <el-form :model="systemInfo" label-width="120px">
        <el-form-item label="临时文件路径">
          <el-input v-model="systemInfo.tmpdir" readonly label="tmpdir"></el-input>
        </el-form-item>
        <el-form-item label="计算机名称">
          <el-input v-model="systemInfo.hostname" readonly label="hostname"></el-input>
        </el-form-item>
        <el-form-item label="系统类型">
          <el-input v-model="systemInfo.type" readonly label="type"></el-input>
        </el-form-item>
        <el-form-item label="平台">
          <el-input v-model="systemInfo.platform" readonly label="platform"></el-input>
        </el-form-item>
        <el-form-item label="CPU架构">
          <el-input v-model="systemInfo.arch" readonly label="arch"></el-input>
        </el-form-item>
        <el-form-item label="系统版本号">
          <el-input v-model="systemInfo.release" readonly label="release"></el-input>
        </el-form-item>
        <el-form-item label="当前运行时间">
          <el-input v-model="systemInfo.uptime" readonly label="uptime"></el-input>
        </el-form-item>
        <el-form-item label="总内存量">
          <el-input v-model="systemInfo.totalmem" readonly label="totalmem"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isDialogShow = false">Cancel</el-button>
          <el-button type="primary" @click="isDialogShow = false">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ipcRenderer } from 'electron'
import { IpcService } from 'frontend/utils/IpcService'
import { STORE_EVENT } from 'shared/Events'
import { ISystemInfo } from 'types/ISystemInfo'
import { ref,reactive } from 'vue';

const key = ref<string>("");
const value = ref<string>("");
const isDialogShow = ref<boolean>(false);
const systemInfo = reactive<ISystemInfo>({});

const handleSave = () => {
  ipcRenderer.invoke(STORE_EVENT.SET, key.value, value.value).then(res => {
    console.log(res)
  })
}

const handleGet = () => {
  ipcRenderer.invoke(STORE_EVENT.GET, key.value).then((res) => {
    console.log(res)
  })
}

const handleGetSystemInfo = async () => {
  const ipcService = new IpcService()
  ipcService.send<ISystemInfo>('system-info').then(res => {
    for(let key in res){
      systemInfo[key] = res[key]
    }
    isDialogShow.value = true
  })
}

</script>
<style scoped>
</style>