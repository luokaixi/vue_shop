import Vue from 'vue'
import App from './App.vue'
import router from './router'
import http from './api/http'
import { Message, MessageBox } from 'element-ui'
import echarts from 'echarts'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import 'nprogress/nprogress.css'

import htmlToPdf from "./utils/htmlToPdf"
Vue.use(htmlToPdf)

Vue.config.productionTip = false

Vue.prototype.$http = http
Vue.prototype.$echarts = echarts
console.log(echarts)
Vue.prototype.$message = Message
Vue.prototype.$messageBox = MessageBox
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
