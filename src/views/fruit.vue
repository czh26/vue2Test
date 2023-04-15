<template>
  <div>
    <div ref="fru">{{ data }}</div>
    <button @click="handle">ref</button>
    <childrenPage ref="child" :asd="asd" @halo="halo"></childrenPage>
    <div>{{ value }}</div>
    <div class="bbb">asd</div>
    <div class="aaa">
      <div class="fafdsafsda">dagdsgasfgds</div>
      <div class="bbb">b</div>
    </div>
    <div class="aaa">
      <div class="bbb">c</div>
    </div>
    <button @click="childDom">获取指定子元素</button>
  </div>
</template>
<script>
import childrenPage from './childrenPage.vue'
export default {
  name: 'ganGuo',
  components: { childrenPage },
  data () {
    return {
      data: '',
      asd: 'qwer',
      value: ''
    }
  },
  methods: {
    handle () {
      this.data = this.$refs.fru
      console.log(this.$refs.child)
    },
    halo (value) {
      this.value = value
    },
    childDom () {
      // .find(item => item === document.getElementsByClassName('bbb'))
      const a = document.getElementsByClassName('aaa')[0].children[1]
      console.log(a)
    }
  },
  created () {},
  mounted () {}
}
</script>
<style lang="scss" scoped></style>
