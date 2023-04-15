<template>
  <div ref="radar" id="radar"></div>
</template>
<script>
export default {
  name: 'radarEchart',
  data () {
    return {
      radar: null
    }
  },
  mounted () {
    this.radar = this.$echarts.init(this.$refs.radar)
    this.drawRadar()
  },
  methods: {
    drawRadar () {
      /** @type EChartsOption */
      const option = {
        title: {
          text: '2023LPL夏季赛数据对比',
          textAlign: 'center',
          left: '50%'
        },
        legend: {
          data: ['TheShy', 'huanfeng'],
          top: '80',
          left: '120',
          orient: 'vertical'
        },
        tooltip: {
          show: true
        },
        radar: {
          indicator: [
            { name: '分均输出', max: 100 },
            { name: '分均经济', max: 100 },
            { name: '分均补刀', max: 100 },
            { name: '伤害转化率', max: 100 },
            { name: 'kda', max: 100 },
            { name: '参团率', max: 100 },
            { name: '输出占比', max: 100 },
            { name: '分均承伤', max: 100 }
          ],
          splitArea: { // 分割区域
            areaStyle: { // 区域样式
              color: ['#ffede6', '#fff']
            }
          },
          axisName: { // radar小标题
            color: '#5c7bd9',
            fontSize: 16,
            fontWeight: 'bold'
          },
          splitNumber: 5 // 指示器分割次数
        },
        series: [
          {
            type: 'radar',
            lineStyle: {
              width: 5
            },
            emphasis: {
              focus: 'series'
            },
            data: [
              {
                name: 'TheShy',
                value: [96, 95, 85, 97, 80, 86, 89, 99]
              }
            ]
          },
          {
            type: 'radar',
            lineStyle: {
              width: 5
            },
            emphasis: {
              focus: 'series'
            },
            data: [
              {
                name: 'huanfeng',
                value: [11, 68, 80, 15, 90, 45, 19, 24]
              }
            ]
          }
        ]
      }
      this.radar.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
#radar {
  width: 800px;
  height: 800px;
  margin: auto;
}
</style>
