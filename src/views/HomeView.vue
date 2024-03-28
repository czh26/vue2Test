<template>
  <div class="home">
    <ol class="list">
      <li>1.<router-link to="/home/performChunk">分时函数</router-link></li>
    </ol>
    <router-view></router-view>
    <!-- <div>
      <el-input
        v-model="username"
        placeholder="请输入用户名"
        style="width: 250px"
      ></el-input
      ><br />
      <el-input
        v-model="password"
        placeholder="请输入密码"
        style="width: 250px"
      ></el-input
      ><br />
      <el-button type="primary" @click="login">登陆</el-button>
      <el-button type="primary" @click="exit">退出</el-button>
    </div> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import Cookies from 'js-cookie'
import Cookies from 'js-cookie'
export default {
  name: 'HomeView',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  watch: {},
  computed: {},
  created () {},
  methods: {
    login () {
      const params = {
        username: this.username,
        password: this.password
      }
      this.$api.post('/api/login', params).then((res) => {
        const data = res.data
        Cookies.set('sys_token', data.token_type + '' + data.access_token, {
          expires: new Date(new Date().getTime() + data.expires_in * 1000)
        })
        Cookies.set('sys_refresh_token', data.refresh_token, {
          expires: new Date(new Date().getTime() + 7 * 24 * 3600 * 1000)
        })
        this.$notify({
          title: '登陆成功',
          type: 'success'
        })
      })
    },
    exit () {
      Cookies.set('sys_token', '')
      Cookies.set('sys_refresh_token', '')
    }
  }
}
</script>
<style lang="scss" scoped>
.list {
  font-size: 30px;
  color: #74b9ff;
  a {
    color: #74b9ff;
  }
}
</style>
