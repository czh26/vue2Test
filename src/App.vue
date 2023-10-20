<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/simpleOL">simpleOL</router-link> |
      <router-link to="/mini-ol">mini-ol</router-link> |
      <router-link to="/mapBlock">map-block</router-link> |
      <router-link to="/dynamic">dynamic</router-link> |
      <router-link to="/measure">measure</router-link> <br />
      <router-link to="/map">map</router-link> |
      <router-link to="/bar">bar</router-link> |
      <router-link to="/line">line</router-link> |
      <router-link to="/pie">pie</router-link> |
      <router-link to="/scatter">scatter</router-link> |
      <router-link to="/radar">radar</router-link> |
      <router-link to="/sunburst">sunburst</router-link> |
      <router-link to="/gauge">gauge</router-link> |
      <router-link to="/wordcloud">wordcloud</router-link> |
      <router-link to="/funnel">funnel</router-link> |
    </nav>
    <router-view />
  </div>
</template>
<script>
import Cookies from 'js-cookie'
import router from './router'
export default {
  mounted () {
    const token = Cookies.get('sys_token')
    if (!token) {
      this.$notify({
        title: '请重新登陆',
        duration: 2000,
        type: 'error',
        showClose: true
      })
      router.push('/')
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
</style>
