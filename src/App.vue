<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> <br>
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
    <router-view/>
  </div>
</template>

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

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
