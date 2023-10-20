<template>
  <div id="waterFall" class="waterFall">
    <div
      class="waterFall_item"
      v-for="(list, listIdx) in waterFallList"
      :key="listIdx"
      :style="colStyle"
    >
      <div class="waterFall_col" v-for="(item, index) in list" :key="index">
        <img class="waterFall_item_img" :src="item.url" />
        <div class="waterFall_item_text">{{ item.text }}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'WaterFall',
  data () {
    return {
      list: [
        {
          url: 'https://img2.baidu.com/it/u=1894489640,257262556&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800',
          text: '测试测试测试测试测试测试测试测'
        },
        {
          url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F53f4756d-b92d-4988-9e67-1670486ec1aa%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1700294685&t=06bc703e774a2d28a7459d476d03f3a0',
          text: '测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试'
        },
        {
          url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Ff3565548-b849-4270-a23a-1d78fb943945%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1700296865&t=01deb9f9b19206bb7190d78b51310031',
          text: '测试测试测试测试测试测试测试测试测试测试测试测试测试测'
        },
        {
          url: 'https://t7.baidu.com/it/u=1126218742,3382842115&fm=193&f=GIF',
          text: '测试测试测试测试测试测试测试测试测试测试测'
        },
        {
          url: 'https://t7.baidu.com/it/u=2604797219,1573897854&fm=193&f=GIF',
          text: '测试测试测试测试测试测试测试测'
        },
        {
          url: 'https://t7.baidu.com/it/u=2501476447,3743798074&fm=193&f=GIF',
          text: '测试测试测试测试测试测试测试'
        },
        {
          url: 'https://hbimg.b0.upaiyun.com/3f13acd7236cbc786e3397d7f703df8067542d15bf16-boiOII_fw658',
          text: '测试测试测试测试测试测试测试'
        },
        {
          url: 'https://hbimg.huaban.com/4dca9dc0526b412347d45fb885ee6cba176749ae5628e-0BjZ19_fw658',
          text: '测试测试测试测试测试测试测试'
        },
        {
          url: 'https://t7.baidu.com/it/u=768965319,3021743516&fm=193&f=GIF',
          text: '测试测试测试测试测试测试测试'
        },
        {
          url: 'https://t7.baidu.com/it/u=2271636767,3442297225&fm=193&f=GIF',
          text: '测试测试测试测试测试测试测试'
        },
        {
          url: 'https://t7.baidu.com/it/u=1738533978,2837442238&fm=193&f=GIF',
          text: '测试测试测试测试测试测试测试'
        },
        {
          url: 'https://t7.baidu.com/it/u=853384970,3524943502&fm=193&f=GIF',
          text: '测试测试测试测试测试测试测试'
        },
        {
          url: 'https://t7.baidu.com/it/u=188814329,824868390&fm=193&f=GIF',
          text: '测试测试测试测试测试测试测试'
        }
      ],
      waterFallList: [],
      colStyle: {
        width: null,
        textAlign: 'center'
      },
      waterFallNum: 0,
      waterFallCol: 6
    }
  },
  watch: {
    waterFallNum (newValue, oldValue) {
      // 清空数组
      this.waterFallList = []
      // 分为n个数组
      for (let j = 0; j < newValue; j++) {
        this.waterFallList.push([])
      }
      // 把数据等量的分为n个数组
      for (let i = 0; i < this.list.length; i++) {
        const groupIndex = i % newValue
        this.waterFallList[groupIndex].push(this.list[i])
      }
    }
  },
  created () {
    // 赋值触发watch
    this.waterFallNum = this.waterFallCol
  },
  mounted () {
    // 监听窗口大小
    window.addEventListener('resize', this.handleResize)
    // 第一次调用
    this.handleResize()
  },
  beforeDestroy () {
    // 卸载监听
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize () {
      const dom = document.getElementById('waterFall')
      // 获取屏幕宽度
      const screenWidth = window.screen.width
      // 获取页面宽度
      const domWidth = dom.offsetWidth
      // 循环列数量的次数
      for (let i = 1; i <= this.waterFallCol; i++) {
        // 当页面宽度小于一定数值时，更改列的数量，更改后跳出循环
        if (domWidth <= (screenWidth / this.waterFallCol) * i) {
          this.waterFallNum = i
          this.colStyle.width = ((domWidth - 20) / i).toString() + 'px'
          break
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.waterFall {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .waterFall_item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    .waterFall_col {
      display: flex;
      flex-direction: column;
      align-items: center;
      .waterFall_item_img {
        width: 96%;
        height: auto;
        border-radius: 10px;
      }
      .waterFall_item_text {
        padding: 0 10px;
        text-align: justify;
      }
    }
  }
}
</style>
