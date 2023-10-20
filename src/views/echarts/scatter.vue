<template>
  <div ref="scatter" id="scatter"></div>
</template>
<script>
export default {
  name: 'scatterEchart',
  data () {
    return {
      scatter: null
    }
  },
  mounted () {
    this.scatter = this.$echarts.init(this.$refs.scatter)
    this.drawScatter()
  },
  methods: {
    drawScatter () {
      /** @type EChartsOption */
      const option = {
        xAxis: {},
        yAxis: {},
        series: [
          {
            type: 'scatter',
            symbolSize: (data) => { return (data[0] + data[1]) * 2 }, // 散点大小
            itemStyle: {
              shadowBlur: 10, //  光晕大小
              shadowColor: '#fd2d5b',
              shadowOffsetY: 5, // Y轴偏移
              color: '#ec7983'
            },
            emphasis: {
              focus: 'series',
              label: {
                show: true,
                position: 'top',
                formatter: function (param) {
                  return param.data
                }
              }
            },
            data: [
              [3.74, 8.04],
              [5.07, 3.95],
              [13.0, 7.58],
              [9.05, 3.81],
              [10.0, 6.33],
              [14.0, 3.96],
              [12.5, 4.82],
              [9.15, 7.2],
              [7.0, 6.26],
              [10.0, 8.84]
            ]
          },
          {
            type: 'scatter',
            symbolSize: (data) => { return (data[0] + data[1]) * 2 }, // 散点大小
            itemStyle: {
              shadowBlur: 10, //  光晕大小
              shadowColor: '#70dfee',
              shadowOffsetY: 5, // Y轴偏移
              color: '#70dfee'
            },
            emphasis: {
              focus: 'series',
              label: {
                show: true,
                position: 'top',
                formatter: function (param) {
                  return param.data
                }
              }
            },
            data: [
              [11.0, 8.33],
              [14.0, 7.66],
              [13.4, 6.81],
              [7.46, 3.56],
              [2.34, 4.96],
              [7.34, 9.47],
              [4.68, 7.44],
              [11.5, 7.2],
              [3.03, 4.23],
              [6.2, 7.83]
            ]
          }
        ]
      }
      this.scatter.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
#scatter {
  width: 800px;
  height: 800px;
  margin: auto;
}
</style>
