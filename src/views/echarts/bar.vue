<template>
  <div ref="bar" id="bar"></div>
</template>
<script>
export default {
  name: 'barEchart',
  data () {
    return {
      bar: null
    }
  },
  mounted () {
    this.bar = this.$echarts.init(this.$refs.bar)
    this.drawBar()
  },
  methods: {
    drawBar () {
      /** @type EChartsOption */
      const option = {
        xAxis: {
          // X轴
          type: 'category', //  example: value,time,log
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          splitLine: {
            //  分隔线
            show: false //  是否显示
          }
        },
        yAxis: {
          // Y轴
          splitLine: {
            show: true
          }
        },
        tooltip: {
          // 提示框
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器
            type: 'cross', // 十字准星,example: line,shadow
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: '{a1}<br/>{b1}：{c1}%' // {a}系列名称(series.name),{b}类目值(xAxis or yAxis .data),{c}数值(series.data)
        },
        legend: {
          // 图例组件,可以通过点击图例控制哪些系列不显示
          data: [
            {
              name: '红色',
              textStyle: { color: '#bf74a1' }
            },
            {
              name: '蓝色',
              textStyle: { color: '#85bed9' }
            }
          ],
          orient: 'vertical',
          top: '85px',
          left: '12%',
          borderWidth: 2,
          textStyle: {
            fontSize: '25px',
            fontWeight: 'BOLD'
          }
        },
        series: [
          //  放数据
          {
            name: '红色',
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            showBackground: false,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
            color: '#bf74a1',
            label: {
              show: true,
              position: 'inside',
              color: '#FFF'
            },
            markLine: {
              data: [{ type: 'average', name: '平均数' }],
              label: {
                show: true,
                position: 'middle',
                color: '#bf74a1'
              },
              lineStyle: {
                width: 3
              }
            }
          },
          {
            name: '蓝色',
            data: [100, 120, 180, 110, 40, 210, 40],
            type: 'bar',
            color: '#85bed9',
            label: {
              show: true,
              position: 'top',
              color: '#85bed9'
            },
            markLine: {
              data: [{ type: 'average', name: '平均数' }],
              label: {
                show: true,
                position: 'middle',
                color: '#85bed9'
              },
              lineStyle: {
                width: 3
              }
            }
          }
        ]
      }
      // const option = {
      //   backgroundColor: '#ffffff',
      //   tooltip: {
      //     trigger: 'axis',
      //     formatter: '{a1}<br/>{b1}：{c1}%'
      //   },
      //   legend: {
      //     data: [ //  必须和series对应
      //       {
      //         name: 'test1 \npink',
      //         textStyle: { color: '#bf74a1' }
      //       },
      //       {
      //         name: 'test2 \nblue',
      //         textStyle: { color: '#85bed9' }
      //       }
      //     ],
      //     orient: 'horizontal', // vertical
      //     top: '85px',
      //     left: '12%',
      //     borderWidth: 2,
      //     borderColor: '#cc99ff',
      //     textStyle: {
      //       fontSize: '25px',
      //       fontWeight: 'bold'
      //     }
      //   },
      //   xAxis: {
      //     splitLine: {
      //       show: false // 去掉网格线
      //     },
      //     type: 'value',
      //     name: 'times of tring',
      //     nameGap: 30, // y轴name与横纵坐标轴线的间距
      //     nameLocation: 'middle', // y轴name处于y轴的什么位置
      //     nameTextStyle: {
      //       fontSize: 25,
      //       fontWeight: 'BOLD'
      //     },
      //     max: 7.41,
      //     axisLabel: {
      //       show: true,
      //       interval: 0,
      //       fontSize: '15px',
      //       formatter: (value) => {
      //         // 1小时=3600秒
      //         if (value === 1) {
      //           return `${value}try`
      //         } else if (value !== 7.41) return `${value}tries`
      //       }
      //     }
      //   },
      //   yAxis: {
      //     splitLine: {
      //       show: false // 去掉网格线
      //     },
      //     axisLabel: {
      //       formatter: '{value}%',
      //       fontSize: '15px'
      //     }
      //   },
      //   series: [
      //     {
      //       name: 'test2 \nblue',
      //       type: 'bar',
      //       barWidth: '30px',
      //       emphasis: {
      //         // 折线图的高亮状态。
      //         focus: 'series' // 聚焦当前高亮的数据所在的系列的所有图形。
      //       },
      //       data: [
      //         [1, 0],
      //         [2, 2],
      //         [3, 8],
      //         [4, 16],
      //         [5, 26],
      //         [6, 33],
      //         [7, 14]
      //       ],

      //       markLine: {
      //         symbol: 'none', // 去掉警戒线最后面的箭头
      //         label: { position: 'end' }, // 将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束

      //         data: [
      //           {
      //             name: 'x1',
      //             xAxis: 5.18,
      //             silent: true,
      //             // 鼠标悬停事件  true没有，false有
      //             lineStyle: {
      //               // 警戒线的样式  ，虚实  颜色
      //               type: 'solid',
      //               color: '#85bed9',
      //               width: 3
      //             },
      //             label: {
      //               show: true,
      //               textStyle: {
      //                 fontSize: '25px',
      //                 color: '#85bed9'
      //               }
      //             }
      //           },

      //           {
      //             name: 'x2',
      //             xAxis: 3.72,
      //             silent: true,
      //             textStyle: {
      //               fontSize: '25px',
      //               color: '#bf74a1'
      //             }, // 鼠标悬停事件  true没有，false有
      //             lineStyle: {
      //               // 警戒线的样式  ，虚实  颜色
      //               type: 'solid',
      //               color: '#bf74a1',
      //               width: 3
      //             },
      //             label: {
      //               show: true,
      //               textStyle: {
      //                 fontSize: '25px',
      //                 color: '#bf74a1'
      //               }
      //             }
      //           }
      //         ]
      //       },
      //       color: '#85bed9'
      //     },
      //     {
      //       name: 'test1 \npink',
      //       type: 'bar',
      //       barWidth: '30px',
      //       emphasis: {
      //         focus: 'series'
      //       },
      //       data: [
      //         [1, 2],
      //         [2, 11],
      //         [3, 34],
      //         [4, 32],
      //         [5, 15],
      //         [6, 6],
      //         [7, 1]
      //       ],
      //       color: '#bf74a1',

      //       markLine: {
      //         symbol: 'none', // 去掉警戒线最后面的箭头
      //         label: { position: 'end' } // 将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
      //       }
      //       // color: '#bf74a1'
      //     }
      //   ]
      // }
      this.bar.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
#bar {
  width: 800px;
  height: 800px;
  margin: auto;
}
</style>
