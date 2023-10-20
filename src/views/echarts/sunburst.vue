<template>
  <div ref="sunburst" id="sunburst"></div>
</template>
<script>
export default {
  name: 'sunburstEchart',
  data () {
    return {
      sunburst: null
    }
  },
  mounted () {
    this.sunburst = this.$echarts.init(this.$refs.sunburst)
    this.drawSunburst()
    this.sunburst.on('click', (params) => {
      console.log(params)
      if (params.data.link) {
        this.$router.push({ path: params.data.link })
        // TODO: 处理节点点击事件
      }
    })
  },
  methods: {
    drawSunburst () {
      /** @type EChartsOption */
      const option = {
        title: {
          text: '简要家庭关系图',
          textAlign: 'center',
          left: '50%'
        },
        series: [
          {
            type: 'sunburst',
            radius: [0, '90%'],
            data: [
              {
                name: '奶奶',
                children: [
                  {
                    name: '父',
                    value: 10,
                    children: [
                      {
                        value: 10
                      }
                    ]
                  },
                  {
                    name: '大伯',
                    value: 10
                  },
                  {
                    name: '二伯',
                    value: 10,
                    children: [
                      {
                        name: '大堂姐',
                        value: 6
                      }
                    ]
                  },
                  {
                    name: '三伯',
                    value: 10,
                    children: [
                      {
                        name: '二堂姐',
                        value: 6
                      }
                    ]
                  }
                ]
              },
              {
                name: '姥姥',
                children: [
                  {
                    name: '母',
                    value: 10,
                    link: '/',
                    children: [
                      {
                        name: '我',
                        value: 20,
                        itemStyle: {
                          color: '#9dfdff'
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
      this.sunburst.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
#sunburst {
  width: 800px;
  height: 800px;
  margin: auto;
}
</style>
