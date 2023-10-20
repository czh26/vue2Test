<template>
  <div class="content">
    <div id="map"></div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'eChart',
  data () {
    return {
      chart: null
    }
  },
  created () {},
  mounted () {
    this.chart = this.$echarts.init(document.getElementById('map'))
    this.drawMap()
  },
  methods: {
    async drawMap () {
      /** @type EChartsOption */
      const option = {
        title: {
          text: '甲流感染病例数量',
          textAlign: 'center',
          top: '5%',
          left: '50%'
        },
        tooltip: { // 提示框组件
          trigger: 'item',
          formatter: '{c}例', // 提示框模板 {a},{b},{c},{d}在不同类型的图中有不同的含义
          // valueFormatter: (val) => { val.toFixed(2) }, //  格式化formatter
          position: ['50%', '10%'], //  提示框的位置
          backgroundColor: 'lightblue', // 提示框背景颜色
          borderColor: 'yellowgreen', //  提示框边框颜色
          borderWidth: 3, // ;提示框边框宽度
          padding: 20, // 提示框内边距
          textstyle: { // 提示框文本样式，包含的属性和css差不多
            color: '#fff'
          }
        },
        // visualMap: { // 划分区域
        //   type: 'piecewise',
        //   left: 200,
        //   bottom: 200,
        //   pieces: [
        //     {
        //       min: 600,
        //       max: 999,
        //       label: '高风险地区',
        //       color: '#C64034'
        //     }, {
        //       min: 300,
        //       max: 600,
        //       label: '中风险地区',
        //       color: '#f9a07b'
        //     },
        //     {
        //       max: 300,
        //       label: '低风险地区',
        //       color: '#F9A79B'
        //     }
        //   ],
        //   color: '#000',
        //   textStyle: {
        //     color: '#000'
        //   },
        //   visibility: 'off'
        // },
        geo: {
          type: 'map',
          map: '新疆',
          roam: true,
          label: {
            normal: {
              show: false // 地图上是否显示标签
            },
            emphasis: {
              show: true
            }
          },
          itemStyle: {
            areaColor: '#eeeeee',
            emphasis: {
              areaColor: '#b1feef' // 鼠标滑过高亮
            }
          },
          data: [
            { name: '喀什地区', value: 100 },
            { name: '昌吉州', value: 523 },
            { name: '阿克苏地区', value: 200 },
            { name: '和田地区', value: 400 }
            // 其他省份的数据
          ]
        },
        series: [
          {
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 20,
            itemStyle: {
              shadowBlur: 10, //  光晕大小
              shadowColor: '#70dfee',
              shadowOffsetY: 5, // Y轴偏移
              color: '#70dfee'
            },
            data: [
              [76.26199734157986, 39.428700358072916],
              [86.58799613489444, 44.14940106720949],
              [81.27105726628078, 41.73563883909547],
              [81.61600951183706, 36.76365222376395]
            ]
          },
          {
            type: 'lines',
            zlevel: 2,
            effect: {
              show: true,
              period: 4, // 箭头指向速度，值越小速度越快
              trailLength: 0.4, // 特效尾迹长度[0,1]值越大，尾迹越长重
              symbol: 'pin', // 箭头图标
              symbolSize: 6 // 图标大小
            },
            lineStyle: {
              normal: {
                color: '#1DE9B6',
                width: 1, // 线条宽度
                opacity: 0.1, // 尾迹线条透明度
                curveness: 0.3 // 尾迹线条曲直度
              }
            },
            data: [
              {
                coords: [
                  [76.26199734157986, 39.428700358072916], [86.58799613489444, 44.14940106720949]
                ],
                lineStyle: { color: '#f25189' }
              }
            ]
          }
        ]

      }
      const geo = await this.getGeoJson('新疆')
      this.$echarts.registerMap('新疆', geo.data)
      // console.log(geo)
      this.chart.setOption(option)
    },
    getGeoJson (name) {
      const res = axios.get(
        // `https://qsh-cdn.bj.bcebos.com/fruit-admin/map/map12.0/${name}.json`
        `https://cdn.xjy0.cn/fruit-admin/map/map12.0/${name}.json`
      )
      return res
    }
  },
  beforeDestroy () {
    if (this.chart) {
      this.chart.dispose()
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
}
#map {
  width: 1200px;
  height: 800px;
  margin: 0 auto;
}
</style>
