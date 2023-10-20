<template>
  <div class="home">
    <el-table :data="pageData">
      <el-table-column align="center" prop="date" label="日期">
        <el-table-column sortable align="center" prop="date" label="日期">
        </el-table-column>
        <el-table-column align="center" prop="date" label="日期">
          <el-table-column align="center" prop="name" label="名字">
          </el-table-column>
          <el-table-column align="center" prop="address" label="地址">
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
    <vxe-table :data="data" ref="table">
      <vxe-table-column
        field="value"
        title="测试1"
        :formatter="formatter"
        :width="minWidth"
        align="center"
      >
      </vxe-table-column>
      <vxe-table-column
        field="value"
        title="测试2"
        :formatter="formatter"
        :width="minWidth"
        align="center"
      >
      </vxe-table-column>
      <vxe-table-column
        field="value"
        title="测试3"
        :formatter="formatter"
        :width="minWidth"
        align="center"
      >
      </vxe-table-column>
      <vxe-table-column
        field="value"
        title="测试4"
        :formatter="formatter"
        :width="minWidth"
        align="center"
      >
      </vxe-table-column>
      <vxe-table-column
        field="value"
        title="测试5"
        :formatter="formatter"
        :width="minWidth"
        align="center"
      >
      </vxe-table-column>
      <vxe-table-column
        field="value"
        title="测试6"
        :formatter="formatter"
        :width="minWidth"
        align="center"
      >
      </vxe-table-column>
    </vxe-table>
    <div class="block">
      <el-pagination
        :current-page.sync="currentPage"
        background
        layout="prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :hide-on-single-page="true"
        @current-change="flip"
      />
    </div>
    <div>
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
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'
import Cookies from 'js-cookie'
export default {
  name: 'HomeView',
  components: {},
  data () {
    return {
      form: {
        tilte: ['全国林业计财报表', '提质增效', '其它'],
        secendLevel: ['干鲜果生产情况', '农林产值情况', '收购销售情况']
      },
      total: null,
      pageSize: 3,
      tableData: [
        {
          date: '1',
          name: '王小虎11',
          address: '上海市普陀区金沙江路 111 弄'
        },
        {
          date: '2',
          name: '王小虎22',
          address: '上海市普陀区金沙江路 222 弄'
        },
        {
          date: '3',
          name: '王小虎33',
          address: '上海市普陀区金沙江路 333 弄'
        },
        {
          date: '4',
          name: '王小虎44',
          address: '上海市普陀区金沙江路 444 弄'
        },
        {
          date: '5',
          name: '王小虎55',
          address: '上海市普陀区金沙江路 555 弄'
        },
        {
          date: '6',
          name: '王小虎66',
          address: '上海市普陀区金沙江路 666 弄'
        }
      ],
      pageData: [],
      currentPage: 1,
      routerList: [
        {
          path: '/ganGuo',
          component: () => import('../views/fruit'),
          meta: { title: '干鲜果' }
        }
      ],
      username: '',
      password: '',
      data: [{ value: '测试测试测试测试测试测试测测试测试测' }],
      minWidth: 150
    }
  },
  watch: {
    minWidth (newValue, oldValue) {
      // minWidth 属性变化时重新渲染组件
      this.$nextTick(() => {
        this.$refs.table.recalculate() // 重新计算表格布局
      })
    }
  },
  computed: {
    ...mapGetters(['test']),
    getter () {
      return this.test
    }
  },
  created () {
    this.total = this.tableData.length
    this.fetchData()
    // const routes = this.$router.options.routes
    // this.routerList.push(routes)
  },
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
    },
    flip (e) {
      // console.log(e)
      this.currentPage = e
      this.pageData = this.queryPage()
    },
    async fetchData () {
      this.pageData = this.queryPage()
    },
    queryPage () {
      const start = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      return this.tableData.slice(start, end)
    },
    handleOpen (key, keyPath) {},
    handleClose (key, keyPath) {},
    handleSelect () {
      console.log(this.routerList.meta)
      this.$router.push({ path: this.routerList[0].path })
    },
    formatter (row) {
      // console.log(title: row.column.title, field: row.cellValue)
      //  动态计算minWidth
      this.minWidth = 350
      return row.cellValue
    }
  }
}
</script>
<style lang="scss" scoped>
.block {
  margin: 40px 0;
}
.vxe-table {
  width: 100%;
}
:deep(.vxe-body--column) {
  // width: 20rem;
  white-space: normal;
}
</style>
