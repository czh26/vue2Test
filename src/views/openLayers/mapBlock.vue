<template>
  <div>
    <div class="nav">
      <el-select
        ref="option"
        v-model="value"
        placeholder="请选择"
        @change="regionChange"
        clearable
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div>
        <van-cell title="图层" is-link @click="togglePopup" />
        <van-popup v-model="showPopup" position="bottom" round>
          <div class="popup_content">
            <van-button type="info" @click="cutMapLayer">切换图层</van-button>
          </div>
        </van-popup>
      </div>
    </div>
    <div id="map"></div>
  </div>
</template>
<script>
import Axios from 'axios'
import GeoJSON from 'ol/format/GeoJSON.js'
import { Map, View } from 'ol'
import VectorLayer from 'ol/layer/Vector.js'
import VectorSource from 'ol/source/Vector.js'
import { defaults as ctlDef } from 'ol/control/defaults'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { Fill, Stroke, Style, Text } from 'ol/style'
import { Select } from 'ol/interaction'
import { pointerMove, singleClick } from 'ol/events/condition'
import { Popup, Cell, Button } from 'vant'
export default {
  name: 'mapBlock',
  components: { [Popup.name]: Popup, [Cell.name]: Cell, [Button.name]: Button },
  data () {
    return {
      map: null,
      xinjiang: null,
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
      tkkey: '4acfdb2d0396a421eb735a4ae8911960',
      regionName: '新疆维吾尔自治区',
      parent: '650000000000',
      adcode: '650000000000',
      options: [
        {
          value: '650000000000',
          label: '新疆维吾尔自治区'
        },
        {
          value: '652800000000',
          label: '巴音郭楞蒙古自治州'
        },
        {
          value: '652824000000',
          label: '若羌县'
        }
      ],
      value: '',
      center: [],
      showPopup: false,
      layerArr: [0, 2]
    }
  },
  created () {},
  async mounted () {
    // CQL_FILTER=parent in (650000000000) or adcode in (650000000000)
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
    this.tMapLayer0 = new TileLayer({
      source: new XYZ({
        url: this.tMap[0].url + this.tkkey,
        title: this.tMap[0].name
      }),
      visible: this.tMap[0].visible
    })
    this.tMapLayer3 = new TileLayer({
      source: new XYZ({
        url: this.tMap[3].url + this.tkkey,
        title: this.tMap[3].name
      }),
      visible: this.tMap[3].visible,
      zIndex: 2
    })
    const view = new View({
      center: [84.94633350000001, 41.755145],
      // extent: this.extent,
      zoom: 6,
      minZoom: 5,
      maxZoom: 15,
      projection: 'EPSG:4326',
      showFullExtent: true //  允许缩放展示全部地图
    })
    this.map = new Map({
      target: 'map',
      view: view,
      layers: [this.layVector, this.tMapLayer0, this.tMapLayer3],
      controls: ctlDef({
        attribution: false,
        rotate: false
      })
    })
    this.selectCondition(pointerMove)
    this.selectCondition(singleClick)
    //  鼠标变pointer
    this.map.on('pointermove', (evt) => {
      const feature = this.map.forEachFeatureAtPixel(
        evt.pixel,
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
    //  选择feature
    selectCondition (type) {
      this.select = new Select({
        condition: type,
        layers: [this.layVector],
        filter: (f) => {
          if (
            f.values_.parent !== '650000000000' &&
            f.values_.name !== '若羌县'
          ) {
            return false
          } else {
            return f.values_.name !== this.regionName
          }
        },
        style: (feature) => {
          const regionName = feature?.values_?.name || ''
          return new Style({
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0)'
            }),
            stroke: new Stroke({
              color: '#e60012',
              width: 5
            }),
            text: new Text({
              text: regionName,
              font: 'bold 1.2rem 幼圆',
              fill: new Fill({
                color: '#095cf9'
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 3
              })
              // overflow: true //  文本允许超出
            })
          })
        }
      })
      this.map.addInteraction(this.select)
      if (type === singleClick) {
        this.select.on('select', async (f) => {
          if (f.selected[0]) {
            const center = f.selected[0].values_.center
              .split(',')
              .map((num) => Number(num))
            this.map.getView().setCenter(center)
            this.map.getView().setZoom(7)
            // //  只保留选择的区划
            const adcode = f.selected[0].values_.adcode
            const features = await this.requestMapData(adcode)
            this.regionName = f.selected[0].values_.name
            this.value = f.selected[0].values_.name
            this.vectorSource.clear()
            this.vectorSource.addFeatures(features)
          }
        })
      }
    },
    async regionChange (regionId) {
      this.$nextTick(() => {
        // this.$refs.option.selectedLabel 获取select的label值(必须放在nextTick里)
        this.regionName = this.$refs.option.selectedLabel
      })
      const features = await this.requestMapData(regionId)
      // this.regionName = features.values_.name
      this.vectorSource.clear()
      this.vectorSource.addFeatures(features)
      this.map.getView().setCenter(this.center)
      this.map.getView().setZoom(6)
    },
    togglePopup () {
      this.showPopup = true
    },
    cutMapLayer () {
      this.layerArr.reverse()
      const n = this.layerArr[0]
      this.tMapLayer0.setSource(new XYZ({
        url: this.tMap[n].url + this.tkkey,
        title: this.tMap[n].name
      }))
    }
  }
}
</script>
<style lang="scss" scoped>
#map {
  width: 100%;
  height: 750px;
  margin: 10px auto;
}
.cursor-pointer {
  cursor: pointer;
}
.van-cell {
  width: 50vw;
}
.nav {
  display: flex;
  justify-content: center;
}
.popup_content {
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
