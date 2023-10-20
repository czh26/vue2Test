<template>
  <div class="home">
    <el-row class="tac">
      <el-col :span="12">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#06186e"
          text-color="#fff"
          unique-opened
          @select="handleSelect"
        >
          <el-submenu
            v-for="(item, index) in form.tilte"
            :key="index"
            :index="item"
          >
            <template slot="title">
              <i class="el-icon-notebook-2" style="color: #fff"></i>
              <span>{{ item }}</span>
            </template>
            <el-menu-item v-for="select in routerList" :index="select.path" :key="select.path" router="true" text-color="#513413"
            >{{ select.meta.title }}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
    <el-table :data="pageData" style="width: 100%">
      <el-table-column align="center" prop="date" label="日期" width="180">
        <el-table-column
          sortable
          align="center"
          prop="date"
          label="日期"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" prop="date" label="日期" width="180">
          <el-table-column align="center" prop="name" label="名字" width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="address"
            label="地址"
            width="180"
          >
          </el-table-column>
        </el-table-column>
      </el-table-column>
    </el-table>
    <div class="block">
      <span class="demonstration">直接前往</span>
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
    <button @click="handle">cookie</button>
    <div>{{ getter }}</div>
    <div>{{ cok }}</div>
  </div>
</template>

<script>
// @ is an alias to /src
// import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'
import { mapGetters } from 'vuex'
export default {
  name: 'HomeView',
  components: {},
  data () {
    return {
      form: {
        tilte: ['全国林业计财报表', '提质增效', '其它'],
        secendLevel: ['干鲜果生产情况', '农林产值情况', '收购销售情况']
      },
      cok: '',
      vx: '',
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
      ]
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
    handle () {
      this.cok = Base64.encode('chenzihan')
      this.$store.commit('add')
      console.log(Base64.decode(this.cok))
      console.log(this.$route.query)
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
    }
  }
}
</script>
<style lang="scss">
a {
  text-decoration: none;
}
</style>
