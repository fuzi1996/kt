<template>
  <div>
    <el-form :model="setting" label-width="120px">
    <el-form-item label="Namespace">
      <el-input v-model="setting.defaultNamespace" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="handleGetSystemInfo">系统信息</el-button>
      <el-button @click="reset">重置</el-button>
    </el-form-item>
  </el-form>
    

    <el-dialog
      v-model="isDialogShow"
      title="系统信息"
      width="400"
      class="system-info"
    >
      <el-row>
        <el-text class="label">计算机名称:</el-text>
        <el-text class="value">{{systemInfo.hostname}} </el-text>
      </el-row>
      <el-row>
        <el-text class="label">临时文件路径:</el-text>
        <el-text class="value">{{systemInfo.tmpdir}} </el-text>
      </el-row>
      <el-row>
        <el-text class="label">系统类型:</el-text>
        <el-text class="value">{{systemInfo.type}} </el-text>
      </el-row>
      <el-row>
        <el-text class="label">平台:</el-text>
        <el-text class="value">{{systemInfo.platform}} </el-text>
      </el-row>
      <el-row>
        <el-text class="label">CPU架构:</el-text>
        <el-text class="value">{{systemInfo.arch}} </el-text>
      </el-row>
      <el-row>
        <el-text class="label">系统版本号:</el-text>
        <el-text class="value">{{systemInfo.release}} </el-text>
      </el-row>
      <el-row>
        <el-text class="label">当前运行时间:</el-text>
        <el-text class="value">{{systemInfo.uptime}} </el-text>
      </el-row>
      <el-row>
        <el-text class="label">总内存量:</el-text>
        <el-text class="value">{{systemInfo.totalmem}} </el-text>
      </el-row>
      <el-row>
        <el-text class="label">用户数据存储路径:</el-text>
        <el-text class="value">{{systemInfo.userDataPath}} </el-text>
      </el-row>
      <el-row>
        <el-text class="label">STORE文件存储路径:</el-text>
        <el-text class="value">{{systemInfo.storePath}} </el-text>
      </el-row>
      <el-row>
        <el-text class="label">日志文件存储路径:</el-text>
        <el-text class="value">{{systemInfo.logPath}} </el-text>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isDialogShow = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ipcRenderer } from 'electron'
import { IpcService } from 'frontend/utils/IpcService'
import { STORE_EVENT,SYSTEM_EVENT } from 'shared/Events'
import { STORE_KEY } from 'shared/Store'
import { ISystemInfo } from 'types/ISystemInfo'
import { ISettings } from 'types/ISetting'
import { ref,reactive, onMounted, toRaw } from 'vue'
import { ElMessage } from 'element-plus'

const isDialogShow = ref<boolean>(false)
const systemInfo = ref<ISystemInfo>({
  hostname: "",
  tmpdir: "",
  type: "",
  platform: "",
  arch: "",
  release: "",
  uptime: 0,
  totalmem: 0,
  userDataPath: '',
  storePath: '',
  logPath: ''
})
const setting = ref<ISettings>({
  defaultNamespace: 'default'
})

onMounted(() => {
  getSetting()
})

const getSetting = () => {
  ipcRenderer.invoke(STORE_EVENT.GET, STORE_KEY.SETTING).then(res => {
    if(res && res.defaultNamespace){
      setting.value = res
    }else{
      setting.value.defaultNamespace = 'default'
    }
  })
}

const reset = () => {
  ipcRenderer.invoke(STORE_EVENT.CLEAR).then(res => {
    ElMessage({
      message: '已重置',
      type: 'success',
    })
    getSetting()
  })
}

const handleSave = () => {
  ipcRenderer.invoke(STORE_EVENT.SET, STORE_KEY.SETTING, toRaw(setting.value)).then(res => {
    ElMessage({
      message: '成功保存',
      type: 'success',
    })
    getSetting()
  })
}

const handleGetSystemInfo = async () => {
  const ipcService = new IpcService()
  ipcService.send<ISystemInfo>(SYSTEM_EVENT.SYSTEM_INFO).then(res => {
    systemInfo.value = res
    isDialogShow.value = true
  })
}

</script>
<style scoped>
.system-info{
  margin-top: 5px;
}
.value{
  margin-left: 10px;
}
</style>