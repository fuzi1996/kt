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
import LogGroups from 'frontend/components/Log.vue'
import SvgIcon from 'frontend/components/svg/SvgIcon.vue'
import 'frontend/samples/node-api'


import 'element-plus/dist/index.css'
import "./style.css"
import 'virtual:svg-icons-register'



const routes = [
  { path: "/namespace", component: DisplayNamespace },
  { path: "/deployment", component: DisplayDeployment },
  { path: "/pod", component: DisplayPodData },
  { path: "/svc", component: DisplaySvcData },
  { path: "/setting", component: SettingsPage },
  { path: "/log", component: LogGroups },
  { path: "/console", component: ConsoleGroups },
  { path: "/", redirect: "/pod" },
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
app.component('SvgIcon', SvgIcon)
app.use(router)


const vm = app.mount('#app')
vm.$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
})
