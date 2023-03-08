import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ConsoleGroups from 'frontend/components/ConsoleGroups.vue'
import DisplayDeployment from 'frontend/components/DisplayDeployment.vue'
import DisplayNamespace from 'frontend/components/DisplayNamespace.vue'
import DisplayPodData from 'frontend/components/DisplayPodData.vue'
import DisplaySvcData from 'frontend/components/DisplaySvcData.vue'
import SettingsPage from 'frontend/components/SettingsPage.vue'
import LogGroups from 'frontend/components/LogGroups.vue'

import 'frontend/samples/node-api'


import 'element-plus/dist/index.css'
import "./style.css"




const routes = [
  { path: "/namespace", component: DisplayNamespace },
  { path: "/deployment", component: DisplayDeployment },
  { path: "/pod", component: DisplayPodData },
  { path: "/svc", component: DisplaySvcData },
  { path: "/setting", component: SettingsPage },
  { path: "/log", component: LogGroups },
  { path: "/console", component: ConsoleGroups },
  { path: "/", redirect: "/log" },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})


const app = createApp(App)

app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)


const vm = app.mount('#app')
vm.$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
