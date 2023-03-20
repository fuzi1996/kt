<template>
  <el-container class="log-container">
    <el-header class="log-header">
      <el-button @click="handleClearConsole">清屏</el-button>
    </el-header>
    <el-main>
      <div id="temp" ref="logWindowRef" class="log-window" :style="{'font-size': fontSize+'px'}"></div>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { LogParam } from 'types/Log'
import { K8S_EVENT, getFlowLogEvent, getCloseFlowLogEvent } from 'shared/Events'
import { ipcRenderer } from 'electron'
import * as ace from "ace-builds/src-noconflict/ace"
import { onMounted, ref, getCurrentInstance } from 'vue'
import { Ace } from "ace-builds/ace"
// import { debounce } from 'frontend/utils'
import 'fast-text-encoding'
import 'ace-builds/esm-resolver'

ace.config.set('basePath', 'ace-builds/src/ace')

const route = useRoute()

const logparam:LogParam = {
  podName: route.query.podName as string,
  namespace: route.query.namespace as string,
  containerName: route.query.containerName as string
}

let editor: Ace.Editor|undefined = undefined
const wrap = ref<boolean>(true)
const darkTheme = ref<boolean>(false)
const autoScroll = ref<boolean>(true)
const logWindowRef = ref<HTMLElement | null>(null)
const lines = ref<number>(0)
const fontSize = ref<number>(14)
interface SystaxHighlighter {
  title: string,
  mode: string
}

const syntaxHighlighters:SystaxHighlighter[] = [
  { title: 'Text', mode: 'ace/mode/text' },
  { title: 'Json', mode: 'ace/mode/json5' },
  { title: 'XML', mode: 'ace/mode/xml' },
]

let syntaxModeIndex:number = 1
const utf8decoder = new TextDecoder();

onMounted(() => {
  initAceEditor()
  initCtrlAndMousewheel()
})

const initCtrlAndMousewheel = () => {
  logWindowRef.value?.addEventListener('wheel', (ev) => {
  const wheelEvent = ev as WheelEvent
  if (wheelEvent.ctrlKey) {
    if(wheelEvent.deltaY < 0){
      fontSize.value+=1
    } else {
      fontSize.value-=1
    }
  }
});
}

ipcRenderer.send(K8S_EVENT.OPEN_FLOW_LOG, logparam)

ipcRenderer.on(getFlowLogEvent(logparam),(_,chunk) => {
  addLog(chunk)
})

const abortFlowLog = () => {
  ipcRenderer.send(getCloseFlowLogEvent(logparam))
}

const setMode = (mode:string) => {
  if(editor) {
    editor.session.setMode(mode)
  }
}

const setTheme = () => {
  var theme = 'ace/theme/textmate';
  if(darkTheme.value) {
    theme = 'ace/theme/terminal';
  }
  if(editor){
    editor.setTheme(theme)
  }
}

const callback = () => {

}

const scrollToLineFunc = (editor:Ace.Editor)=>{
  return function(){
    editor.renderer.scrollToLine(Number.POSITIVE_INFINITY,false,false,callback)
  }
}

function debounce(func: () => void, wait: number, immediate:boolean = true): Function {
  console.log('debounce')
	let timeout:any = null
	return function() {
		const context = this
    const [args] = arguments
		const later = function() {
			timeout = null
			if (!immediate){
        func.apply(context, args)
      }
		}
		const callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow) {
      func.apply(context, args)
    }
	}
}

const dataChangedEvent = () => {
  console.log('dataChangedEvent')
  if(editor){
    debounce(scrollToLineFunc(editor), 500)
  }
}

const scrollBottom = () => {
  console.log('scrollBottom')
  if(editor && autoScroll.value){
    editor.scrollToLine(editor.session.getLength(), false, true, callback)
  }
}

const autoScrollFunc = () => {
  console.log('autoScrollFunc')
  autoScroll.value = !autoScroll.value
  if(editor){
    if(autoScroll.value) {
      scrollBottom()
      editor.session.on('change', dataChangedEvent)
    } else {
      editor.session.off('change', dataChangedEvent)
    }
  }
}

const initAceEditor = () => {
  editor = ace.edit(logWindowRef.value, {
    // autoScrollEditorIntoView: true,
    // readOnly: true,
    // showGutter: false,
    // showLineNumbers: true,
    // vScrollBarAlwaysVisible: true,
    // wrapBehavioursEnabled: true,
    // autoScrollEditorIntoView: true,
    // wrap: true,
  })
  if(editor){
    editor.setReadOnly(true)
    editor.setHighlightActiveLine(true)
    editor.session.setUseWrapMode(wrap.value)
    editor.resize()
    const mode = syntaxHighlighters[syntaxModeIndex].mode
    setMode(mode)
    setTheme()
    // autoScrollFunc()
    // editor.session.selection.on('changeCursor', () => {
    //   console.log('changeCursor')
    //   if(editor){
    //     var cursorRow = editor.session.selection.getCursor().row + 1
    //     if(autoScroll.value && cursorRow < lines.value) {
    //       autoScrollFunc()
    //     }
    //     else if(!autoScroll.value && cursorRow >= lines.value) {
    //       autoScrollFunc()
    //     }
    //   }
    // })
  }
}

const addLog = (data: any) => {
  if(editor){
    const sess = editor.session
    sess.insert({ row: sess.getLength(), column: 0 }, utf8decoder.decode(data))
    lines.value = sess.getLength()
  }
}

const handleClearConsole = () => {
  if(editor){
    editor.setValue('')
    getCurrentInstance()?.proxy?.$forceUpdate()
  }
}
</script>
<style scoped>
.log-container{
  width: 100%;
  height: 100%;
}
.log-window{
  width: 100%;
  height: 100%;
}
.log-header{
  height: 15px;
  margin-bottom: 3px;
  margin-top: 3px;
}
</style>