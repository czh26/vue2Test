import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as echarts from 'echarts'
import 'echarts-liquidfill' // 水球图插件
import 'echarts-wordcloud' // 词云插件
import api from './api/index'
import Vant from 'vant'
import 'vant/lib/index.css'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
Vue.prototype.$api = api
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Vant)
Vue.use(VXETable)
Vue.prototype.$echarts = echarts
new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
