<template>
  <div ref="gauge" id="gauge"></div>
</template>
<script>
export default {
  name: 'gaugeEchart',
  data () {
    return {
      gauge: null
    }
  },
  mounted () {
    this.gauge = this.$echarts.init(this.$refs.gauge)
    this.drawGauge()
  },
  methods: {
    drawGauge () {
      /** @type EChartsOption */
      const value = 0.3421
      const option = {
        title: [
          {
            text: '停车场已使用',
            textAlign: 'center',
            left: '50%',
            top: '40%',
            textStyle: {
              fontSize: '40',
              color: '#fff'
            }
          },
          {
            text: (value.toFixed(4) * 100) + '%',
            textAlign: 'center',
            left: '50%',
            top: '50%',
            textStyle: {
              fontSize: '40',
              color: '#fff'
            }
          }
        ],
        series: [
          {
            type: 'gauge',
            radius: '100%',
            z: 2,
            startAngle: 0,
            endAngle: 360,
            axisLine: {
              show: false // 仪表盘轴线
            },
            axisTick: {
              distance: -6,
              lineStyle: {
                color: '#2AECFF',
                width: 15,
                type: 20, // 设置上限
                dashOffset: 18, // 下限,相减就是宽度
                opacity: 0.8
              },
              splitNumber: 5
            },
            splitLine: {
              show: false // 分割线
            },
            axisLabel: {
              show: false // 刻度标签
            },
            pointer: {
              show: false // 仪表盘指针
            },
            data: []
          },
          {
            type: 'liquidFill', // 外部插件
            radius: '95%',
            z: 1,
            center: ['50%', '50%'],
            amplitude: 20, // 振幅
            backgroundStyle: {
              color: '#0d2d42'
            },
            color: [
              {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: '#0061A2'
                  },
                  {
                    offset: 0,
                    color: '#00FFE5'
                  }
                ],
                globalCoord: false
              }
            ],
            data: [ // 三层涟漪效果
              value + 0.02,
              {
                value: value + 0.01,
                direction: 'left' // 方向
              },
              value - 0.01
            ],
            label: {
              normal: {
                formatter: '' // 显示的值为空
              }
            },
            outline: { // 外圈线
              show: true,
              borderDistance: 0,
              itemStyle: {
                borderWidth: 2,
                borderColor: '#2AECFF'
              }
            }
          }
        ]
      }
      this.gauge.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
#gauge {
  width: 100%;
  height: 800px;
  margin: auto;
  background-color: #0d2d42;
}
</style>
