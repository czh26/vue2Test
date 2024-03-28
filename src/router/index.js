import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: '首页' },
    children: [
      {
        path: 'performChunk',
        component: () => import('../views/upGradeJS/performChunk'),
        meta: { title: '分时函数' }
      }
    ]
  },
  {
    path: '/mini-ol',
    component: () => import('../views/openLayers/mini-ol'),
    meta: { title: 'mini-OL' }
  },
  {
    path: '/simpleOL',
    component: () => import('../views/openLayers/simple'),
    meta: { title: 'OL地图' }
  },
  {
    path: '/mapBlock',
    component: () => import('../views/openLayers/mapBlock'),
    meta: { title: '地图块' }
  },
  {
    path: '/dynamic',
    component: () => import('../views/openLayers/dynamic'),
    meta: { title: '动态要素' }
  },
  {
    path: '/measure',
    component: () => import('../views/openLayers/measure'),
    meta: { title: '测量' }
  },
  {
    path: '/waterfall',
    component: () => import('../views/upGradeJS/waterfall'),
    meta: { title: '瀑布流' }
  },
  {
    path: '/map',
    component: () => import('../views/echarts/map')
  },
  {
    path: '/bar',
    component: () => import('../views/echarts/bar')
  },
  {
    path: '/pie',
    component: () => import('../views/echarts/pie')
  },
  {
    path: '/line',
    component: () => import('../views/echarts/line')
  },
  {
    path: '/radar',
    component: () => import('../views/echarts/radar')
  },
  {
    path: '/sunburst',
    component: () => import('../views/echarts/sunburst')
  },
  {
    path: '/gauge',
    component: () => import('../views/echarts/gauge')
  },
  {
    path: '/wordcloud',
    component: () => import('../views/echarts/wordcloud')
  },
  {
    path: '/funnel',
    component: () => import('../views/echarts/funnel')
  },
  {
    path: '/scatter',
    component: () => import('../views/echarts/scatter')
  },
  {
    path: '/drawline',
    component: () => import('../views/canvas/drawline')
  },
  {
    path: '/graffiti',
    component: () => import('../views/canvas/graffiti')
  },
  {
    path: '/svg',
    component: () => import('../views/svg/draw')
  }
]
const router = new VueRouter({
  routes
})

export default router
