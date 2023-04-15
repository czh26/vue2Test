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
