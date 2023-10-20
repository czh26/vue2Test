import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
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
    component: () => import('../views/waterfall'),
    meta: { title: '瀑布流' }
  },
  {
    path: '/ganGuo',
    component: () => import('../views/fruit'),
    meta: { title: '干鲜果' }
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
  }
]
const router = new VueRouter({
  routes
})

export default router
