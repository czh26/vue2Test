<template>
  <div ref="wordcloud" id="wordcloud">adsd</div>
</template>
<script>
export default {
  name: 'wordCloud',
  data () {
    return {
      wordcloud: null
    }
  },
  mounted () {
    this.wordcloud = this.$echarts.init(this.$refs.wordcloud)
    this.drawWordcloud()
  },
  methods: {
    drawWordcloud () {
      /** @type EChartsOption */
      const list = [
        {
          value: '50',
          name: '华为',
          textStyle: {
            color: '#73DDFF'
          }
        }, // 50
        { value: '30', name: 'VIVO' },
        { value: '29', name: 'OPPO' },
        { value: '28', name: 'HONOR' },
        { value: '27', name: '红米' },
        { value: '30', name: '小米', textStyle: { color: '#73DDFF' } },
        { value: '25', name: '美图' },
        { value: '24', name: 'ONEPLUS' },
        { value: '23', name: '魅族' },
        { value: '22', name: '红手指' },
        { value: '21', name: 'SAMSUNG' },
        { value: '20', name: '金立' },
        { value: '16', name: 'BLACKBERRY' },
        { value: '15', name: '诺基亚' },
        { value: '14', name: '锤子' },
        { value: '13', name: '大疆' },
        { value: '12', name: '361' },
        { value: '11', name: '摩托罗拉' },
        { value: '10', name: '联想' },
        { value: '9', name: '玩家国度' }
      ]
      const option = {
        series: [
          {
            type: 'wordCloud',
            gridSize: 30, // 间距
            shape: 'circle', // 形状  example:pentagon
            sizeRange: [15, 50], // 大小
            rotationRange: [0, 0], //  旋转
            data: list
          }
        ]
      }
      this.wordcloud.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
#wordcloud {
  width: 800px;
  height: 800px;
  margin: auto;
}
</style>
