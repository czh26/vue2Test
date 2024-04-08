<template>
  <div id="app">
    <nav>
      <router-link to="/home">Home</router-link> |
      <router-link to="/simpleOL">simpleOL</router-link> |
      <router-link to="/mini-ol">mini-ol</router-link> |
      <router-link to="/mapBlock">map-block</router-link> |
      <router-link to="/dynamic">dynamic</router-link> |
      <router-link to="/measure">measure</router-link> |
      <router-link to="/waterfall">waterfall</router-link> <br />
      <router-link to="/map">map</router-link> |
      <router-link to="/bar">bar</router-link> |
      <router-link to="/line">line</router-link> |
      <router-link to="/pie">pie</router-link> |
      <router-link to="/scatter">scatter</router-link> |
      <router-link to="/radar">radar</router-link> |
      <router-link to="/sunburst">sunburst</router-link> |
      <router-link to="/gauge">gauge</router-link> |
      <router-link to="/wordcloud">wordcloud</router-link> |
      <router-link to="/funnel">funnel</router-link> <br />
      <router-link to="/drawline">drawline</router-link> |
      <router-link to="/graffiti">mobile-drawline</router-link> <br />
      <router-link to="/svg">svg</router-link>
    </nav>
    <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="(item, index) in routerList"
        :key="index"
        :to="{ path: item.path }"
        >{{ item.name }}</el-breadcrumb-item
      >
    </el-breadcrumb>
    <router-view />
  </div>
</template>
<script>
// import Cookies from 'js-cookie'
// import router from './router'
export default {
  data () {
    return {
      routerList: []
    }
  },
  mounted () {
  },
  watch: {
    // 监听路由信息对象中的path属性
    '$route.path' () {
      const matched = this.$route.matched
      const arr = []
      matched.forEach(item => {
        arr.push({
          path: item.path,
          name: item.meta.title
        })
      })
      this.routerList = arr
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.breadcrumb {
  display: flex;
  justify-content: center;
}
</style>
