<template>
  <div class="wrapper">
    <el-checkbox v-model="checked">选择交互方式：</el-checkbox>
    <el-select
      v-model="actionType"
      placeholder=""
      :disabled="!checked"
      @change="actionChange"
    >
      <el-option v-for="item in interaction" :key="item" :value="item">
      </el-option>
    </el-select>
    <div class="checkbox">
      <el-checkbox
        v-model="checkAll"
        @change="handleCheckAllChange"
        >全选</el-checkbox
      >
      <el-checkbox-group
        v-model="checkedLayers"
        @change="handleCheckedCitiesChange"
      >
        <el-checkbox v-for="layer in layers" :label="layer" :key="layer" @change="handleCheckedChange">{{
          layer
        }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div id="map"></div>
    <div id="pentagram">
      <img src="./头像.jpg" alt="" />
    </div>
    <div id="fruitDialog" v-show="fruitVisiable">
      <div class="title">水果信息<span @click="exitDialog">×</span></div>
      <div class="content">
        <div>名称：{{ this.fruitData.fruitType }}</div>
        <div>经纬度定位：{{ this.fruitData.location }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import Axios from 'axios'
// import XYZ from 'ol/source/XYZ'
import TileLayer from 'ol/layer/Tile'
import { Map, View, Overlay } from 'ol'
import { defaults as ctlDef } from 'ol/control/defaults'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import GeoJSON from 'ol/format/GeoJSON.js'
import Fill from 'ol/style/Fill'
import Stroke from 'ol/style/Stroke.js'
import { transformExtent, get as getProjection, fromLonLat } from 'ol/proj.js'
import Text from 'ol/style/Text.js'
import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import { getWidth } from 'ol/extent'
import { Style, Icon } from 'ol/style.js'
import Feature from 'ol/Feature'
import { Point } from 'ol/geom'
import { Select, Draw, Modify, Snap } from 'ol/interaction'
export default {
  name: 'mini-ol',
  data () {
    return {
      map: null,
      xinjiang: null,
      tkkey: '4acfdb2d0396a421eb735a4ae8911960',
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
      bounds: [73.506474, 35.233478, 96.386193, 49.175788],
      iconUrl: 'https://cdn.xjy0.cn/fruit-admin/status/',
      fruitIcon: [
        '红枣',
        '核桃',
        '石榴',
        '葡萄',
        '苹果',
        '沙棘',
        '枸杞',
        '杏',
        '梨'
      ],
      gridNames: [],
      resolutions: [],
      BoundarySource: null,
      JutestSource: null,
      PolygontolineSource: null,
      interaction: ['Circle', 'Point', 'Polygon', 'LineString'],
      actionType: 'Point',
      checked: false,
      fruitData: [],
      fruitVisiable: false,
      layers: ['Boundary层', 'Jutest层', 'Polygontoline层', 'Icon层'],
      checkedLayers: ['Boundary层', 'Jutest层', 'Polygontoline层', 'Icon层'],
      checkAll: true
    }
  },
  watch: {
    checked: function (newVal, oldVal) {
      if (newVal) {
        this.mapInteraction(this.actionType)
      } else {
        this.map.removeInteraction(this.modify)
        this.map.removeInteraction(this.draw)
        this.map.removeInteraction(this.snap)
      }
    }
  },
  created () {},
  async mounted () {
    const url =
      'http://geoserver.xjy0.cn/geoserver/wg/ows?service=WFS&version=1.0.0&request=GetFeature&typename=wg:bounds&srsname=EPSG:3857&maxFeatures=20000&outputFormat=application/json&CQL_FILTER=parent%20in%20(650000000000)%20or%20adcode%20in%20(650000000000)'
    await Axios.get(url).then((res) => {
      this.xinjiang = new GeoJSON().readFeatures(res.data, {
        dataProjection: 'EPSG:3857', // 数据输入格式3857
        featureProjection: 'EPSG:4326' //  数据输出格式4326
      })
      this.extent = transformExtent(res.data.bbox, 'EPSG:3857', 'EPSG:4326')
    })
    await this.requestSet()
    this.BoundaryLayer = new TileLayer({
      source: this.BoundarySource,
      visible: true,
      zIndex: 0
    })
    this.JutestLayer = new TileLayer({
      source: this.JutestSource,
      visible: true,
      zIndex: 1
    })
    this.PolygontolineLayer = new TileLayer({
      source: this.PolygontolineSource,
      visible: true,
      zIndex: 2
    })
    //  瓦片层
    // const layer = new TileLayer({
    //   source: new XYZ({
    //     url: this.tMap[2].url + this.tkkey,
    //     title: this.tMap[2].name
    //   }),
    //   visible: this.tMap[2].visible
    // })
    // const layer1 = new TileLayer({
    //   source: new XYZ({
    //     url: this.tMap[1].url + this.tkkey,
    //     title: this.tMap[1].name
    //   }),
    //   visible: this.tMap[1].visible
    // })
    this.vectorSource = new VectorSource({
      features: this.xinjiang
    })
    this.iconSource = new VectorSource({})
    const layVector = new VectorLayer({
      source: this.vectorSource,
      zIndex: 3
    })
    this.iconVector = new VectorLayer({
      source: this.iconSource,
      zIndex: 3
    })
    const view = new View({
      center: [84.94633350000001, 41.755145],
      zoom: 6,
      maxZoom: 10,
      projection: 'EPSG:4326',
      extent: this.extent,
      showFullExtent: true //  允许缩放展示全部地图
    })
    this.map = new Map({
      target: 'map',
      layers: [
        layVector,
        this.BoundaryLayer,
        this.JutestLayer,
        this.PolygontolineLayer,
        this.iconVector
      ],
      view: view,
      controls: ctlDef({
        attribution: false,
        rotate: false
      })
    })
    this.map.getView().fit(this.bounds, { size: this.map.getSize() })
    const mapFeatures = this.vectorSource.getFeatures()

    mapFeatures.forEach((f) => {
      f.setStyle(
        new Style({
          zIndex: 3,
          stroke: new Stroke({
            color: '#ff68e0',
            width: 1
          }),
          text: new Text({
            text: f.values_.name === '新疆维吾尔自治区' ? '' : f.values_.name,
            font: 'bold 1rem 幼圆',
            fill: new Fill({
              color: '#fff'
            })
          })
        })
      )
    })
    //  icon图标
    const pentagram = new Overlay({
      element: document.getElementById('pentagram'),
      position: [87.522705, 44.019615]
    })
    this.map.addOverlay(pentagram)
    //  点击选择地图feature
    const select = new Select()
    select.on('select', (e) => {})
    //  监听水果图标点击
    this.map.on('singleclick', (evt) => {
      this.map.forEachFeatureAtPixel(
        //  遍历feature
        evt.pixel,
        (feature, layer) => {
          console.log(layer)
          if (feature.values_.data) {
            this.fruitVisiable = true
            this.fruitData = feature.values_.data
            this.iconOverlay(this.fruitData)
          }
        }
      )
    })
    //  鼠标变pointer
    this.map.on('pointermove', (e) => {
      const feature = this.map.forEachFeatureAtPixel(
        e.pixel,
        (feature) => feature
      )
      const mapElement = document.getElementById('map')
      if (feature) {
        // 如果鼠标悬停在 feature 上，给map添加class
        mapElement.classList.add('cursor-pointer')
      } else {
        mapElement.classList.remove('cursor-pointer')
      }
    })
  },
  methods: {
    //  请求集合
    async requestSet () {
      const params = {
        regionId: 'bda9db30-ee35-4563-ba38-581459e0f65e',
        fruitName: '全部'
      }
      this.getWMTS_Source('rq_fruit:boundary').then((source) => {
        this.BoundarySource = source
      })
      this.getWMTS_Source('rq_fruit:jutest').then((source) => {
        this.JutestSource = source
      })
      this.getWMTS_Source('rq_fruit:polygontoline').then((source) => {
        this.PolygontolineSource = source
      })
      this.$api
        .get('/api/chanyebuju/developmentPlat', { params })
        .then((res) => {
          const data = res.data.data
          data.forEach((item) => {
            const point = fromLonLat(item.location.split(','), 'EPSG:4326')
            this.iconFeature = new Feature({
              geometry: new Point(point)
            })
            const style = new Style({
              zIndex: 3,
              image: new Icon({
                src: `//cdn.xjy0.cn/fruit-admin/status/${item.fruitType}.png`,
                scale: 0.7
              })
            })
            this.iconFeature.setStyle(style)
            this.iconFeature.set('data', item)
            this.iconFeature.setId(item.location)
            this.iconSource.addFeature(this.iconFeature)
          })
        })
    },
    //  获取新疆地图source
    getWMTS_Source (layerName) {
      return new Promise((resolve) => {
        const projection = getProjection('EPSG:4326')
        const projectionExtent = projection.getExtent()
        const size = getWidth(projectionExtent) / 256
        const resolutions = new Array(31)
        const matrixIds = new Array(31)
        for (let z = 0; z < 30; ++z) {
          resolutions[z] = size / Math.pow(2, z)
          matrixIds[z] = `EPSG:4326:${z}`
        }
        this.resolutions = [
          0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
          0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125,
          0.001373291015625, 6.866455078125e-4, 3.4332275390625e-4,
          1.71661376953125e-4, 8.58306884765625e-5, 4.291534423828125e-5,
          // eslint-disable-next-line no-loss-of-precision
          2.1457672119140625e-5, 1.0728836059570312e-5, 5.364418029785156e-6,
          2.682209014892578e-6, 1.341104507446289e-6, 6.705522537231445e-7,
          3.3527612686157227e-7
        ]
        this.matrixIds = matrixIds
        this.gridNames = [
          'EPSG:4326:0',
          'EPSG:4326:1',
          'EPSG:4326:2',
          'EPSG:4326:3',
          'EPSG:4326:4',
          'EPSG:4326:5',
          'EPSG:4326:6',
          'EPSG:4326:7',
          'EPSG:4326:8',
          'EPSG:4326:9',
          'EPSG:4326:10',
          'EPSG:4326:11',
          'EPSG:4326:12',
          'EPSG:4326:13',
          'EPSG:4326:14',
          'EPSG:4326:15',
          'EPSG:4326:16',
          'EPSG:4326:17',
          'EPSG:4326:18',
          'EPSG:4326:19',
          'EPSG:4326:20',
          'EPSG:4326:21'
        ]
        const source = new WMTS({
          url: '//geoserver-test3.xjy0.cn/geoserver/gwc/service/wmts',
          layer: layerName,
          style: '',
          matrixSet: 'EPSG:4326',
          format: 'image/png',
          projection: getProjection('EPSG:4326'),
          tileGrid: new WMTSTileGrid({
            origin: [-180.0, 90.0], // 必填
            extent: [-180.0, -90.0, 180.0, 90.0],
            // resolutions: this.resolutions, // 必填
            resolutions: this.resolutions, // 必填
            matrixIds: this.matrixIds, // 必填
            tileSize: [256, 256]
          }),
          wrapX: true
        })
        resolve(source)
      })
    },
    //  map交互功能
    mapInteraction (type) {
      this.modify = new Modify({
        //  修改地图元素
        source: this.vectorSource
      })
      this.draw = new Draw({
        //  画元素
        source: this.vectorSource,
        type
      })
      this.snap = new Snap({
        //  捕捉功能，例如边缘对齐
        source: this.vectorSource
      })
      this.map.addInteraction(this.modify)
      this.map.addInteraction(this.draw)
      this.map.addInteraction(this.snap)
    },
    //  交互方式开关
    actionChange () {
      this.map.removeInteraction(this.modify)
      this.map.removeInteraction(this.draw)
      this.map.removeInteraction(this.snap)
      this.mapInteraction(this.actionType)
    },
    //  icon弹窗
    iconOverlay (data) {
      const position = data.location.split(',').map((num) => Number(num))
      const dialog = document.getElementById('fruitDialog')
      this.fruitOverlay = new Overlay({
        element: dialog,
        position,
        offset: [-175, -130]
        // autoPan: true //  遇到超出边框自动移动地图
      })
      this.map.addOverlay(this.fruitOverlay)
      //  autoPan和animate的center冲突
      this.map.getView().animate({
        center: position,
        zoom: 7,
        duration: 1000
      })
      // this.map.getView().setCenter(position)
      // this.map.getView().setZoom(8)
    },
    //  关闭弹窗
    exitDialog () {
      this.fruitVisiable = false
    },
    //  layer层全选
    handleCheckAllChange (isAllChecked) {
      this.checkedLayers = isAllChecked ? this.layers : []
      if (isAllChecked) {
        const layers = this.map.getLayers()
        if (!layers.getArray().includes(this.BoundaryLayer)) {
          this.map.addLayer(this.BoundaryLayer)
        }
        if (!layers.getArray().includes(this.JutestLayer)) {
          this.map.addLayer(this.JutestLayer)
        }
        if (!layers.getArray().includes(this.PolygontolineLayer)) {
          this.map.addLayer(this.PolygontolineLayer)
        }
        this.map.addLayer(this.iconVector)
      } else {
        this.map.removeLayer(this.BoundaryLayer)
        this.map.removeLayer(this.JutestLayer)
        this.map.removeLayer(this.PolygontolineLayer)
        this.map.removeLayer(this.iconVector)
      }
    },
    //  判断是否全选
    handleCheckedCitiesChange (val) {
      if (this.layers.length === val.length) {
        this.checkAll = true
      } else {
        this.checkAll = false
      }
    },
    //  选择layer层
    handleCheckedChange (isChecked, evt) {
      switch (evt.target._value) {
        case 'Boundary层':
          isChecked ? this.map.addLayer(this.BoundaryLayer) : this.map.removeLayer(this.BoundaryLayer)
          break
        case 'Jutest层':
          isChecked ? this.map.addLayer(this.JutestLayer) : this.map.removeLayer(this.JutestLayer)
          break
        case 'Polygontoline层':
          isChecked ? this.map.addLayer(this.PolygontolineLayer) : this.map.removeLayer(this.PolygontolineLayer)
          break
        case 'Icon层':
          isChecked ? this.map.addLayer(this.iconVector) : this.map.removeLayer(this.iconVector)
          break
        default:
          this.map.addLayer(this.BoundaryLayer)
          this.map.addLayer(this.JutestLayer)
          this.map.addLayer(this.PolygontolineLayer)
          this.map.addLayer(this.iconVector)
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
div {
  margin: 0;
  padding: 0;
}
.wrapper {
  width: 100%;
  height: 80vh;
}
#map {
  width: 95vw;
  height: 70vh;
  margin: 2vw auto;
  overflow: visible !important;
}
#pentagram > img {
  width: 40px;
  height: 40px;
}
#fruitDialog {
  width: 350px;
  height: 100px;
  color: #fff;
  background: linear-gradient(180deg, #42e695, #3bb2b8);
  border-radius: 20px;
  opacity: 0.8;
  z-index: 100;
}
#fruitDialog::before {
  content: "";
  display: block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 20px 10px 0 10px;
  border-color: #3bb2b8 transparent transparent transparent;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%);
}
.title {
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title > span {
  position: absolute;
  top: 5px;
  right: 20px;
  font-size: 30px;
  cursor: pointer;
}
.content {
  height: 70%;
  display: flex;
  align-items: center;
}
.content > div {
  flex: 1;
}
.cursor-pointer {
  cursor: pointer;
}
.checkbox {
  width: 100%;
  display: flex;
  margin: 10px auto;
  justify-content: center;
}
.checkbox>.el-checkbox {
  margin: 0 30px;
}
</style>
