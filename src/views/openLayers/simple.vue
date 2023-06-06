<template>
  <div class="wrapper">
    <div class="mapWrapper">
      <div id="map" ref="map"></div>
      <div id="map1" ref="map1" tabindex="0"></div>
    </div>
    <div id="pentagram">
      <img src="../../assets/pentagram.png" alt="" @click="showInfo" />
    </div>
    <span id="status"></span>
    <button style="width: 100px; height: 50px" @click="cutMap">切换</button>
    <button @click="toCD">显示成都</button>
  </div>
</template>
<script>
import { Map, View, Overlay } from 'ol'
import { defaults as ctlDef } from 'ol/control/defaults'
import { defaults as itaDef } from 'ol/interaction/defaults'
import TileLayer from 'ol/layer/Tile'
// import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
import GeoJSON from 'ol/format/GeoJSON.js'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import { Select } from 'ol/interaction.js'
import { useGeographic } from 'ol/proj.js'
import Style from 'ol/style/Style.js'
import Fill from 'ol/style/Fill.js'
import Text from 'ol/style/Text.js'
export default {
  name: 'simpleOL',
  data () {
    return {
      map: null,
      map1: null,
      isCut: false
    }
  },
  created () {},
  mounted () {
    useGeographic() //  转换坐标系4326
    // 经纬度坐标转换 ol.proj.transform([104.06, 30.67], 'EPSG:4326', 'EPSG:3857')
    const view = new View({
      // extent: [
      //   8184265.519607211, 4034937.445001186, 10742765.68785077, 6298411.200019843
      // ],
      // center: [9816348.960597549, 4725337.067190478], // 定义地图显示中心于经度0度，纬度0度处
      center: [-100, 38.5],
      zoom: 4 // 并且定义地图显示层级为2
    })
    const view1 = new View({
      center: [103.710937, 38.85682],
      zoom: 4, // 默认缩放
      //  限制缩放
      minZoom: 3,
      // maxZoom: 8,
      projection: 'EPSG:4326'
    })
    //  高德地图
    const gaodeMapLayer = new TileLayer({
      source: new XYZ({
        url: 'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
      })
    })
    const vector = new VectorSource({
      url: 'https://openlayers.org/data/vector/us-states.json',
      format: new GeoJSON()
    })
    this.map = new Map({
      // 让id为map的div作为地图的容器
      target: 'map',
      // 设置地图图层
      layers: [
        // 创建一个使用Open Street Map地图源的瓦片图层
        // new TileLayer({source: new OSM()})
        new VectorLayer({
          background: 'white',
          source: vector
        })
        // gaodeMapLayer
      ],
      // 设置显示地图的视图
      view: view,
      controls: ctlDef({
        attribution: false,
        rotate: false
      })
    })
    this.map1 = new Map({
      // 让id为map的div作为地图的容器
      target: 'map1',
      // 设置地图图层
      layers: [
        // 创建一个使用Open Street Map地图源的瓦片图层
        // new TileLayer({ source: new OSM() })
        // 创建一个使用高德地图源的瓦片图层
        gaodeMapLayer
      ],
      // 设置显示地图的视图
      view: view1,
      interaction: itaDef({
        //  内置交互
        DragRotate: true,
        KeyboardPan: true //  键盘上下左右控制平移,dom组件上必须加上tabindex
      }),
      controls: ctlDef({
        attribution: false,
        rotate: false
      })
    })
    this.map1.on('singleclick', function (evt) {})
    const pentagram = new Overlay({
      element: document.getElementById('pentagram')
    })
    pentagram.setPosition([87.275391, 44.002694])
    this.map1.addOverlay(pentagram)

    // 选中功能
    const select = new Select()
    select.on('select', (e) => {
      if (!e.selected.length) return

      const features = e.target.getFeatures()
      const areaName = features.array_[0].values_.name
      const style = new Style({
        fill: new Fill({
          color: '#88d5f2'
        }),
        //  选中区域显示名字
        text: new Text({
          text: areaName,
          font: '15px sans-serif',
          overflow: true,
          fill: new Fill({
            color: '#fc5351'
          })
        })
      })
      features.forEach((feature) => {
        //  使用的是继承Collection类的forEach方法
        feature.setStyle(style)
      })
    })
    this.map.on('singleclick', (e) => {
      this.map.removeInteraction(select)
      this.map.addInteraction(select)
    })
  },
  methods: {
    cutMap () {
      this.isCut = !this.isCut
      if (this.isCut) {
        this.map.setTarget('map1')
        this.map1.setTarget('map')
      } else {
        this.map.setTarget('map')
        this.map1.setTarget('map1')
      }
    },
    toCD () {
      //  切换到成都 并且添加动画
      this.map1.getView().fit([104, 30.6, 104.12, 30.74], {
        size: this.map1.getSize(),
        duration: 1000,
        callback: (res) => {
          //  回调函数,成功放回true
          if (res) {
            alert('到成都了')
          }
        }
      })
    },
    showInfo () {
      console.log([87.275391, 44.002694])
    }
  }
}
</script>
<style lang="scss" scoped>
.mapWrapper {
  display: flex;
  justify-content: center;
}
#map {
  width: 1000px;
  height: 600px;
  margin: 0 20px;
}
#map1 {
  width: 600px;
  height: 400px;
}
#pentagram > img {
  width: 20px;
  cursor: pointer;
}
:deep(.ol-zoom-in),
:deep(.ol-zoom-out) {
  width: 30px;
  height: 30px;
  font-size: 20px;
  margin: 0 5px;
  border: none;
  border-radius: 5px;
  background-color: #fab1a0;
  opacity: 0.6;
}
</style>
