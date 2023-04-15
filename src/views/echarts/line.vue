<template>
  <div ref="line" id="line">line</div>
</template>
<script>
export default {
  name: 'lineEchart',
  data () {
    return {
      line: null
    }
  },
  mounted () {
    this.line = this.$echarts.init(this.$refs.line)
    this.drawLine()
  },
  methods: {
    drawLine () {
      /** @type EChartsOption */
      const option = {
        xAxis: {
          type: 'category',
          data: ['星期一', '星期二', '星期三', '星期二', '星期五'],
          boundaryGap: false // 坐标轴两边留白策略
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis', // 提示框
          axisPointer: { // 坐标轴指示器
            type: 'cross', //  十字准星,example: line,shadow
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: [
            {
              name: 'test1',
              textStyle: { color: '#9f9fff' }
            },
            {
              name: 'test2'
            }
          ]
        },
        series: [
          {
            name: 'test1',
            data: [23, 64, 32, 45, 43],
            type: 'line',
            stack: 'total',
            lineStyle: {
              color: '#bbe9a6',
              width: 8
            },
            areaStyle: {
              color: '#bbe9a6'
            },
            emphasis: { // 重点
              focus: 'series' // 聚焦 series淡入淡出
            }
          },
          {
            name: 'test2',
            data: [26, 45, 89, 23, 56],
            type: 'line',
            stack: 'total', // 堆叠
            lineStyle: {
              color: '#a3daef',
              width: 8
            },
            areaStyle: {
              color: '#a3daef'
            },
            emphasis: {
              focus: 'series'
            }
          }
        ]
      }
      this.line.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
#line {
  width: 800px;
  height: 800px;
  margin: auto;
}
</style>
