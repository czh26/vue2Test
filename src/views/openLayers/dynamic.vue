<template>
  <div id="map"></div>
</template>
<script>
import Axios from 'axios'
import GeoJSON from 'ol/format/GeoJSON.js'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import { Map, View } from 'ol'
import { defaults as ctlDef } from 'ol/control/defaults'
import { get as getProjection } from 'ol/proj.js'
import { Fill, Stroke, Style, Text } from 'ol/style'
import XYZ from 'ol/source/XYZ'
import WMTS from 'ol/source/WMTS'
import WMTSTileGrid from 'ol/tilegrid/WMTS'
import TileWMS from 'ol/source/TileWMS.js'
export default {
  name: 'mini-ol',
  data () {
    return {
      map: null,
      xinjiang: null,
      boundarySource: null,
      boundaryVector: null,
      tMapLayer0: null,
      tMapLayer3: null,
      txjSource: null,
      txjLayer: null,
      tkkey: '4acfdb2d0396a421eb735a4ae8911960',
      tMap: [
        {
          url:
            '//t{0-7}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=',
          name: '天地图卫星图',
          label: 'TDD', // 天地图底图
          visible: true
        },
        {
          url:
            'http://t3.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=',
          name: '卫星注记',
          label: 'TDB', // 天地图标注图
          visible: true
        },
        {
          url:
            'http://t3.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=',
          name: '天地图矢量图',
          label: 'TDS', // 天地图矢量图
          visible: true
        },
        {
          url:
            'http://t3.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=',
          name: '矢量注记',
          label: 'TDSB', // 天地图矢量标注图
          visible: true
        }
      ],
      resolutions: [],
      extent: [],
      region: {
        id: '654000000000',
        name: '伊犁哈萨克自治州'
      }
    }
  },
  created () {},
  mounted () {
    this.initOpenLayer()
  },
  methods: {
    // 初始化OpenLayers地图
    async initOpenLayer () {
      await this.requestMapData(this.region.id)
      this.boundarySource = new VectorSource({
        features: this.xinjiang
      })
      this.boundaryVector = new VectorLayer({
        source: this.boundarySource,
        zIndex: 1,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0)'
          })
        })
      })
      this.tMapLayer0 = new TileLayer({
        source: new XYZ({
          url: this.tMap[0].url + this.tkkey,
          title: this.tMap[0].name
        }),
        visible: this.tMap[0].visible,
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
      this.txjLayer = new TileLayer({
        source: this.txjSource,
        visible: true,
        zIndex: 2
      })
      const view = new View({
        center: this.center,
        zoom: 6,
        maxZoom: 15,
        projection: 'EPSG:4326',
        extent: this.extent,
        showFullExtent: true //  允许缩放展示全部地图
      })
      this.map = new Map({
        target: 'map',
        layers: [
          this.tMapLayer0,
          this.tMapLayer3,
          this.boundaryVector,
          this.txjLayer
        ],
        view: view,
        controls: ctlDef({
          attribution: false,
          rotate: false
        })
      })
      this.boundaryStyle()
      this.getFeatureInfo()
    },
    // 边界样式
    boundaryStyle () {
      const boundaryFeatures = this.boundarySource.getFeatures()
      boundaryFeatures.forEach(f => {
        // 筛掉总区划
        if (this.region.name === f.values_.name) return
        f.setStyle(
          new Style({
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0)'
            }),
            stroke: new Stroke({
              color: '#095cf9',
              width: 2
            }),
            text: new Text({
              text: f.values_.name === '新疆维吾尔自治区' ? '' : f.values_.name,
              font: 'bold 1rem 幼圆',
              fill: new Fill({
                color: '#095cf9'
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 3
              })
            })
          })
        )
      })
    },
    // 用户交互
    mapInteraction () {},
    // 点击要素获取数据
    getFeatureInfo () {
      this.map.on('singleclick', evt => {
        const view = this.map.getView()
        const viewResolution = view.getResolution()
        const params = {
          INFO_FORMAT: 'application/json',
          // 要素最大值
          FEATURE_COUNT: 2000,
          STYLES: '',
          // 查询语句
          CQL_FILTER: 'ysdm in (2020)'
        }
        // 获取feature url地址
        const url = this.txjSource.getFeatureInfoUrl(
          // 坐标
          evt.coordinate,
          // 分辨率
          viewResolution,
          // 获取投影坐标系对象
          view.getProjection(),
          params
        )
        Axios.get(url).then(res => {
          const features = new GeoJSON().readFeatures(res.data)
          if (features.length) {
            console.log(features)
          }
        })
      })
    },
    //  请求边界数据
    async requestMapData (adcode) {
      const url = `http://geoserver.xjy0.cn/geoserver/wg/ows?service=WFS&version=1.0.0&request=GetFeature&typename=wg:bounds&srsname=EPSG:4326&maxFeatures=20000&outputFormat=application/json&CQL_FILTER=parent%20in%20(${adcode})%20or%20adcode%20in%20(${adcode})`
      await Axios.get(url).then(res => {
        this.xinjiang = new GeoJSON().readFeatures(res.data)
        this.extent = res.data.bbox
        res.data.features.forEach(feature => {
          if (feature.properties.adcode === adcode) {
            if (adcode === '650000000000') {
              this.center = [84.94633350000001, 41.755145]
            } else {
              this.center = feature.properties.center
                .split(',')
                .map(num => Number(num))
            }
          }
        })
      })
      this.getWMS_CQL_Source('txj:tx_protected').then(
        source => {
          this.txjSource = source
        }
      )
      // this.getWMTS_Source('txj:tx_protected').then(
      //   source => {
      //     this.txjSource = source
      //   }
      // )
    },
    // 获取WMS数据
    getWMS_CQL_Source () {
      return new Promise(resolve => {
        const source = new TileWMS({
          url: '//geoserver-test3.xjy0.cn/geoserver/txj/wms',
          params: {
            FORMAT: 'image/png',
            refresh: new Date().getTime(),
            VERSION: '1.1.1',
            // 图层name
            LAYERS: 'txj:tx_protected',
            STYLES: '',
            // 查询语句
            CQL_FILTER: 'ysdm in (2020)',
            exceptions: 'application/vnd.ogc.se_inimage',
            // 范围
            BBOX: [80.163907, 42.258971, 85.254984, 44.843573]
          }
        })
        resolve(source)
      })
    },
    //  获取新疆地图source
    getWMTS_Source (layerName) {
      return new Promise(resolve => {
        const matrixIds = new Array(31)
        for (let z = 0; z < 30; ++z) {
          matrixIds[z] = `EPSG:4326:${z}`
        }
        this.resolutions = [
          0.703125,
          0.3515625,
          0.17578125,
          0.087890625,
          0.0439453125,
          0.02197265625,
          0.010986328125,
          0.0054931640625,
          0.00274658203125,
          0.001373291015625,
          6.866455078125e-4,
          3.4332275390625e-4,
          1.71661376953125e-4,
          8.58306884765625e-5,
          4.291534423828125e-5,
          2.1457672119140625e-5,
          // eslint-disable-next-line no-loss-of-precision
          1.0728836059570312e-5,
          5.364418029785156e-6,
          2.682209014892578e-6,
          1.341104507446289e-6,
          6.705522537231445e-7,
          3.3527612686157227e-7
        ]
        this.matrixIds = matrixIds
        const source = new WMTS({
          url:
            '//geoserver-test3.xjy0.cn/geoserver/gwc/service/wmts',
          layer: layerName,
          style: '',
          matrixSet: 'EPSG:4326',
          format: 'image/png',
          projection: getProjection('EPSG:4326'),
          tileGrid: new WMTSTileGrid({
            origin: [-180.0, 90.0], // 必填
            extent: [-180.0, -90.0, 180.0, 90.0],
            resolutions: this.resolutions, // 必填
            matrixIds: this.matrixIds, // 必填
            tileSize: [256, 256]
          }),
          wrapX: true
        })
        resolve(source)
      })
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
  height: 80vh;
  margin: 0 auto;
  overflow: visible !important;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
