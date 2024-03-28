<template>
  <div>
    <div>
      <button @click="undo">撤回</button>
    </div>
    <svg
      ref="svgCanvas"
      width="400"
      height="400"
      style="border: 1px solid #ccc"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @touchstart="startDrawing"
      @touchmove="draw"
      @touchend="stopDrawing"
    >
      <image
        href="https://qsh-cdn.bj.bcebos.com/achievements/admin/%E7%AC%AC%E4%B8%80%E5%90%8D.png"
        width="100%"
        height="100%"
      ></image>
      <!-- <rect width="100%" height="100%" fill="white"></rect> -->
      <path
        v-for="(path, index) in paths"
        :key="index"
        :d="path.d"
        fill="transparent"
        stroke="black"
        stroke-width="2"
      ></path>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'APP',
  data () {
    return {
      isDrawing: false,
      currentPath: [],
      paths: []
    }
  },
  methods: {
    startDrawing (e) {
      this.isDrawing = true
      this.currentPath = []
      this.draw(e)
    },
    draw (e) {
      if (!this.isDrawing) return

      const svgCanvas = this.$refs.svgCanvas
      const rect = svgCanvas.getBoundingClientRect()
      const mouseX = e.type.startsWith('touch')
        ? e.touches[0].clientX - rect.left
        : e.clientX - rect.left
      const mouseY = e.type.startsWith('touch')
        ? e.touches[0].clientY - rect.top
        : e.clientY - rect.top

      this.currentPath.push({ x: mouseX, y: mouseY })

      // 实时更新数据
      this.$set(this.paths, this.paths.length, {
        d: this.getPathData(this.currentPath)
      })
    },
    stopDrawing () {
      if (this.isDrawing) {
        this.isDrawing = false
      }
    },
    undo () {
      console.log(this.paths)
      if (this.paths.length > 0) {
        // 撤回：移除最后一条路径
        this.paths.pop()
        this.clearCanvas()
        this.redrawPaths()
      }
    },
    getPathData (path) {
      return `M${path.map((point) => `${point.x} ${point.y}`).join(' L')}`
    },
    clearCanvas () {
      const svgCanvas = this.$refs.svgCanvas
      const context = svgCanvas.getContext('2d')
      context.clearRect(0, 0, svgCanvas.width, svgCanvas.height)
    },
    redrawPaths () {
      this.paths.forEach((path) => {
        for (let i = 1; i < path.length; i += 2) {
          this.drawSegment(path[i - 1], path[i])
        }
      })
    },
    drawSegment (start, end) {
      const svgCanvas = this.$refs.svgCanvas
      const context = svgCanvas.getContext('2d')

      context.beginPath()
      context.moveTo(start.x, start.y)
      context.lineTo(end.x, end.y)
      context.stroke()
    }
  }
}
</script>

<style scoped>
/* 可以添加样式 */
</style>
