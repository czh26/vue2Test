<template>
  <div ref="pie" id="pie"></div>
</template>
<script>
export default {
  name: 'pieEchart',
  data () {
    return {
      pie: null
    }
  },
  mounted () {
    this.pie = this.$echarts.init(this.$refs.pie)
    this.drawPie()
  },
  methods: {
    drawPie () {
      /** @type EChartsOption */
      const option = {
        tooltip: {
          show: true
        },
        color: [
          new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#c23531' },
            { offset: 0.5, color: '#2f4554' },
            { offset: 1, color: '#61a0a8' }
          ]),
          '#2f4554',
          '#61a0a8',
          '#d48265',
          '#91c7ae'
        ],
        series: [
          {
            name: '饼图',
            type: 'pie',
            radius: ['50%', '90%'],
            roseType: 'radius', // 通过半径区分数据大小 area(只改变高度) radius(高度和长度都改变)
            itemStyle: {
              //  每一项的样式
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 5
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              },
              itemStyle: {}
            },
            data: [
              { name: '星期一', value: 873 },
              { name: '星期二', value: 724 },
              { name: '星期三', value: 328 },
              { name: '星期四', value: 578 },
              { name: '星期五', value: 184 }
            ]
          }
        ]
      }
      this.pie.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
#pie {
  width: 800px;
  height: 800px;
  margin: auto;
}
</style>
