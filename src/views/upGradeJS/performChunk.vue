<template>
  <div id="wrapper">
    <div style="font-size: 30px; color: #42b983">分时函数</div>
    <button @click="create()">创建100000个div</button>
    <div id="test"></div>
  </div>
</template>
<script>
import { performChunk } from './segmentation.js'
export default {
  name: 'APP',
  data () {
    return {}
  },
  created () {},
  mounted () {},
  methods: {
    create () {
      const datas = Array.from({ length: 100000 }, (_, i) => i)
      // for (const i of datas) {
      //   const div = document.createElement('div')
      //   div.textContent = i
      //   document.getElementById('test').appendChild(div)
      // }
      performChunk(datas)
    }
  }
}
</script>
<style lang="scss" scoped></style>
