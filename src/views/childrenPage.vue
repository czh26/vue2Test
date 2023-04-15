<template>
  <div>
    {{ asd }}
    <button @click="transmit">子父pass</button>
  </div>
</template>
<script>
export default {
  name: 'childrenPage',
  props: ['asd'],
  data () {
    return {
      qwe: 'zxc'
    }
  },
  methods: {
    transmit () {
      this.$emit('halo', 'czh')
    }
  },
  created () {},
  mounted () {}
}
</script>
<style lang="scss" scoped></style>
