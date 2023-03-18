import { createApp } from 'vue'
import Entry from './Entry.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Log from 'frontend/components/Log.vue'
import SvgIcon from 'frontend/components/svg/SvgIcon.vue'


import 'element-plus/dist/index.css'
import "./style.css"
import 'virtual:svg-icons-register'



const routes = [
  { path: "/log", component: Log },
  { path: "/", redirect: "/log" }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})


const app = createApp(Entry)

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
