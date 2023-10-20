<template>
  <div ref="funnel" id="funnel"></div>
</template>
<script>
export default {
  name: 'funnelEchart',
  data () {
    return {
      funnel: null
    }
  },
  mounted () {
    this.funnel = this.$echarts.init(this.$refs.funnel)
    this.drawFunnel()
  },
  methods: {
    drawFunnel () {
      /** @type EChartsOption */
      const option = {
        series: [
          {
            type: 'funnel',
            sort: 'ascending', // 排序 升:ascending,降:descending
            gap: 5, // 间隔
            label: { // 标签
              show: true,
              position: 'outside', // 内部
              fontSize: 16,
              backgroundColor: '#5b7ad8',
              padding: 10,
              borderRadius: 10,
              color: '#fff',
              shadowBlur: 5,
              shadowOffsetX: -5,
              shadowColor: '#a3b5e9',
              formatter: '{b} : {c}'
            },
            data: [
              { value: 1, name: '人类' },
              { value: 2, name: '鸡' },
              { value: 3, name: '虫子' }
            ]
          }
        ]
      }
      this.funnel.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
#funnel {
  width: 800px;
  height: 800px;
  margin: auto;
}
</style>
