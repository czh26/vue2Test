<template>
  <div class="wrapper">
    <div class="interaction">
      <el-checkbox v-model="measureChecked"
        >选择绘制类型：
        <el-select
          id="type"
          v-model="measureType"
          :disabled="!measureChecked"
          @change="measureChange"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-checkbox>
    </div>
    <div id="map" class="map"></div>
  </div>
</template>
<script>
import Axios from 'axios'
import GeoJSON from 'ol/format/GeoJSON.js'
import XYZ from 'ol/source/XYZ'
import { defaults as ctlDef } from 'ol/control/defaults'
import { Draw, Select, Snap } from 'ol/interaction'
import Map from 'ol/Map.js'
import Overlay from 'ol/Overlay.js'
import View from 'ol/View.js'
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style.js'
import { LineString, Polygon } from 'ol/geom.js'
import { Vector as VectorSource } from 'ol/source.js'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js'
import { getArea, getLength } from 'ol/sphere.js'
import { unByKey } from 'ol/Observable.js'
import { pointerMove } from 'ol/events/condition'
export default {
  name: 'APP',
  data () {
    return {
      map: null,
      xinjiang: null,
      sketch: null,
      draw: null,
      helpTooltipElement: null,
      helpTooltip: null,
      measureTooltipElement: null,
      measureTooltip: null,
      tkkey: '4acfdb2d0396a421eb735a4ae8911960',
      regionName: '新疆维吾尔自治区',
      parent: '650000000000',
      adcode: '650000000000',
      continueLineMsg: '双击结束绘制线段',
      continuePolygonMsg: '双击结束绘多边形',
      measureType: 'LineString',
      measureChecked: false,
      tMap: [
        {
          url: '//t{0-7}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=',
          name: '天地图卫星图',
          label: 'TDD', // 天地图底图
          visible: true
        },
        {
          url: 'http://t3.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=',
          name: '卫星注记',
          label: 'TDB', // 天地图标注图
          visible: true
        },
        {
          url: 'http://t3.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=',
          name: '天地图矢量图',
          label: 'TDS', // 天地图矢量图
          visible: true
        },
        {
          url: 'http://t3.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=',
          name: '矢量注记',
          label: 'TDSB', // 天地图矢量标注图
          visible: true
        }
      ],
      options: [
        {
          value: 'LineString',
          label: '线段'
        },
        {
          value: 'Polygon',
          label: '多边形'
        }
      ]
    }
  },
  watch: {
    // 选择绘制类型
    measureChecked (newVal, oldVal) {
      if (newVal) {
        //  卸载select事件
        this.map.removeInteraction(this.select)

        this.measureAddInteraction(this.measureType)
        this.map.getViewport().addEventListener('mouseout', () => {
        //  鼠标移出地图时隐藏helpTooltip
          this.helpTooltipElement.classList.add('hidden')
        })
        this.map.on('pointermove', this.pointerMoveHandler)
      } else {
        //  卸载绘制事件
        this.map.removeInteraction(this.draw)
        this.map.removeInteraction(this.snap)
        this.map.un('pointermove', this.pointerMoveHandler)

        this.addSelect()
      }
    }
  },
  created () {},
  async mounted () {
    await this.requestMapData('650000000000')
    this.vectorSource = new VectorSource({
      features: this.xinjiang
    })
    this.layVector = new VectorLayer({
      source: this.vectorSource,
      zIndex: 1,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0)'
        }),
        stroke: new Stroke({
          color: '#095cf9',
          width: 2
        })
      })
    })
    this.tMapLayer2 = new TileLayer({
      source: new XYZ({
        url: this.tMap[2].url + this.tkkey,
        title: this.tMap[2].name
      }),
      visible: this.tMap[2].visible,
      zIndex: 0
    })
    this.tMapLayer3 = new TileLayer({
      source: new XYZ({
        url: this.tMap[3].url + this.tkkey,
        title: this.tMap[3].name
      }),
      visible: this.tMap[3].visible,
      zIndex: 2
    })
    this.view = new View({
      center: [84.94633350000001, 41.755145],
      // extent: this.extent,
      zoom: 6,
      minZoom: 5,
      projection: 'EPSG:4326',
      showFullExtent: true //  允许缩放展示全部地图
    })
    this.source = new VectorSource({})

    this.vector = new VectorLayer({
      source: this.source,
      style: {
        'fill-color': 'rgba(255, 255, 255, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33'
      }
    })
    this.map = new Map({
      layers: [this.layVector, this.tMapLayer2, this.tMapLayer3, this.vector],
      target: 'map',
      view: this.view,
      controls: ctlDef({
        attribution: false,
        rotate: false
      })
    })
    this.addSelect()
  },
  methods: {
    //  请求新疆地图块数据
    async requestMapData (adcode) {
      const url = `http://geoserver.xjy0.cn/geoserver/wg/ows?service=WFS&version=1.0.0&request=GetFeature&typename=wg:bounds&srsname=EPSG:4326&maxFeatures=20000&outputFormat=application/json&CQL_FILTER=parent%20in%20(${adcode})%20or%20adcode%20in%20(${adcode})`
      await Axios.get(url).then((res) => {
        this.xinjiang = new GeoJSON().readFeatures(res.data)
        res.data.features.forEach((feature) => {
          if (feature.properties.adcode === adcode) {
            if (adcode === '650000000000') {
              this.center = [84.94633350000001, 41.755145]
            } else {
              this.center = feature.properties.center
                .split(',')
                .map((num) => Number(num))
            }
          }
        })
        // this.extent = res.data.bbox
        // this.xinjiang.splice(14, 1)
      })
      return this.xinjiang
    },
    //  格式化线段长度
    formatLength (line) {
      const length = getLength(line) * 100000
      let output
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km'
      } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm'
      }
      return output
    },
    //  格式化区域面积
    formatArea (polygon) {
      const area = getArea(polygon) * 1000000
      let output
      if (area > 100000) {
        output = ' ' + (area / 1000000).toFixed(2) + ' ' + '万km²'
      } else if (area < 100000 && area > 100) {
        output = ' ' + (area / 100).toFixed(2) + ' ' + 'km²'
      } else {
        output = ' ' + (area * 10).toFixed(2) + ' ' + 'm²'
      }
      return output
    },
    //  添加绘制交互
    measureAddInteraction (type) {
      this.draw = new Draw({
        source: this.source,
        type: type,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2
          }),
          image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
              color: 'rgba(0, 0, 0, 0.7)'
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            })
          })
        })
      })
      // const modify = new Modify({
      //   //  修改地图元素
      //   source: source
      // })
      this.snap = new Snap({
        //  捕捉功能，例如边缘对齐
        source: this.vectorSource
      })
      this.map.addInteraction(this.draw)
      // this.map.addInteraction(modify)
      this.map.addInteraction(this.snap)

      this.createMeasureTooltip()
      this.createHelpTooltip()

      let listener
      this.draw.on('drawstart', (evt) => {
        this.sketch = evt.feature
        let tooltipCoord = evt.coordinate
        listener = this.sketch.getGeometry().on('change', (evt) => {
          //  监听线条
          const geom = evt.target
          let output
          if (geom instanceof Polygon) {
            output = this.formatArea(geom)
            tooltipCoord = geom.getInteriorPoint().getCoordinates()
          } else if (geom instanceof LineString) {
            output = this.formatLength(geom)
            tooltipCoord = geom.getLastCoordinate()
          }
          this.measureTooltipElement.innerHTML = output
          this.measureTooltip.setPosition(tooltipCoord)
        })
      })

      this.draw.on('drawend', (evt) => {
        this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static'
        this.measureTooltip.setOffset([0, -7])
        // unset this.sketch
        this.sketch = null
        // 取消tooltip，以便添加新的tooltip
        this.measureTooltipElement = null
        this.createMeasureTooltip()
        //  删除监听器
        unByKey(listener)
        // 获取绘制结束时的要素几何
        console.log(evt.feature.getGeometry())
      })
    },
    //  移动鼠标时的tooltip
    pointerMoveHandler (evt) {
      if (evt.dragging) {
        return
      }
      let helpMsg = '单击开始绘制'
      if (this.sketch) {
        //  当sketch有feature值时
        const geom = this.sketch.getGeometry()
        if (geom instanceof Polygon) {
          helpMsg = this.continuePolygonMsg
        } else if (geom instanceof LineString) {
          helpMsg = this.continueLineMsg
        }
      }
      this.helpTooltipElement.innerHTML = helpMsg
      this.helpTooltip.setPosition(evt.coordinate)
      this.helpTooltipElement.classList.remove('hidden')
    },
    //  创建具体数值tooltip
    createHelpTooltip () {
      if (this.helpTooltipElement) {
        this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement)
      }
      this.helpTooltipElement = document.createElement('div')
      this.helpTooltipElement.className = 'ol-tooltip hidden'
      this.helpTooltip = new Overlay({
        element: this.helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
      })
      this.map.addOverlay(this.helpTooltip)
    },
    //  创建测量tooltip
    createMeasureTooltip () {
      if (this.measureTooltipElement) {
        this.measureTooltipElement.parentNode.removeChild(
          this.measureTooltipElement
        )
      }
      this.measureTooltipElement = document.createElement('div')
      this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure'
      this.measureTooltip = new Overlay({
        element: this.measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
        stopEvent: false,
        insertFirst: false
      })
      this.map.addOverlay(this.measureTooltip)
    },
    //  给地图添加select交互
    addSelect () {
      this.select = new Select({
        condition: pointerMove,
        layers: [this.layVector],
        filter: (f) => {
          if (f.values_.name === '新疆维吾尔自治区') {
            return false
          } else {
            return true
          }
        },
        style: (f) => {
          const multiPolygon = f.getGeometry()
          const area = this.formatArea(multiPolygon)
          //  这里添加的样式必须包含this.layVector的样式，不然样式频繁变动会闪烁
          return new Style({
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0)'
            }),
            stroke: new Stroke({
              color: '#ff7675',
              width: 5
            }),
            text: new Text({
              text: f.values_.name + '\n' + area,
              font: 'bold 1.2rem 幼圆',
              fill: new Fill({
                color: '#ff7675'
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 3
              }),
              offsetY: f.values_.name === '克孜勒苏柯尔克孜自治州' ? -20 : f.values_.name === '乌鲁木齐市' ? 50 : 0
              // overflow: true
            })
          })
        }
      })
      // select.on('select', (evt) => {})
      this.map.addInteraction(this.select)
    },
    //  select改变时
    measureChange (type) {
      this.map.removeInteraction(this.draw)
      this.measureAddInteraction(type)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  user-select: none; //  文字不会被选中
}
.interaction {
  margin-bottom: 1rem;
}
.map {
  width: 100%;
  height: 750px;
}
:deep(.hidden) {
  display: none;
}
//  controls组件
:deep(.ol-zoom) {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  user-select: none; //  文字不会被选中
}
// tooltip整体wrapper
:deep(.ol-tooltip) {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  opacity: 0.7;
  white-space: nowrap;
  font-size: 12px;
  cursor: default;
  user-select: none;
}
// tooltip背景
:deep(.ol-tooltip-measure) {
  opacity: 1;
  font-weight: bold;
}
// tooltip字体
:deep(.ol-tooltip-static) {
  background-color: #ffcc33;
  color: black;
  border: 1px solid white;
}
//  确定后的样式
:deep(.ol-tooltip-measure:before),
:deep(.ol-tooltip-static:before) {
  border-top: 6px solid rgba(0, 0, 0, 0.5);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
  content: "";
  position: absolute;
  bottom: -6px;
  margin-left: -7px;
  left: 50%;
}
//  tooltip下箭头
:deep(.ol-tooltip-static:before) {
  border-top-color: #ffcc33;
}
</style>
