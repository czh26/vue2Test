<template>
  <div>
    <canvas
      class="canvas"
      ref="myCanvas"
      width="400"
      height="400"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
    ></canvas>
    <div>
      <button @click="eraserMode = false">使用画笔</button>
      <button @click="eraserMode = true">使用橡皮擦</button>
      <button @click="undo">撤销</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      isDrawing: false,
      eraserMode: false,
      isEraser: false,
      drawingStack: [],
      currentPath: [],
      redoHistory: [],
      eraserStack: [],
      lastX: '',
      lastY: ''
    }
  },
  mounted () {
    this.initializeCanvas()
  },
  methods: {
    // 初始化画板
    initializeCanvas () {
      this.canvas = this.$refs.myCanvas
      this.ctx = this.canvas.getContext('2d')
      this.ctx.lineWidth = 3
      this.ctx.lineJoin = 'round'
      this.ctx.lineCap = 'round'
      this.ctx.strokeStyle = 'blue'
      this.ctx.imageSmoothingEnabled = true
      this.ctx.translate(0.1, 0.1)
    },
    // 开始绘制时
    startDrawing (e) {
      if (this.eraserMode) {
        this.isEraser = true
        // this.ctx.clearRect()
      } else {
        this.ctx.globalCompositeOperation = 'source-over'
        this.isDrawing = true
        this.currentPath = []
        this.ctx.beginPath()
        this.ctx.moveTo(this.getMouseX(e), this.getMouseY(e))
        this.lastX = this.getMouseX(e)
        this.lastY = this.getMouseY(e)
        console.log(this.lastX, this.lastY)
      }
    },
    // 绘制
    draw (e) {
      if (this.eraserMode) {
        if (this.isEraser) {
          this.ctx.clearRect(this.getMouseX(e), this.getMouseY(e), 5, 5)
        }
      } else {
        if (!this.isDrawing) return
        console.log(e.x, e.y)
        this.currentPath.push({
          x: this.getMouseX(e),
          y: this.getMouseY(e),
          isDrawing: !this.eraserMode
        })
        const controlX = (this.lastX + this.getMouseX(e)) / 2
        const controlY = (this.lastY + this.getMouseY(e)) / 2
        this.ctx.quadraticCurveTo(this.lastX, this.lastY, controlX, controlY)
        this.ctx.stroke()
        this.lastX = controlX
        this.lastY = controlY
        // this.ctx.lineTo(this.getMouseX(e), this.getMouseY(e))
        // this.ctx.stroke()
      }
    },
    // 停止绘制时
    stopDrawing (e) {
      if (this.isDrawing) {
        this.drawingStack.push([...this.currentPath])
      }
      this.isDrawing = false
      this.isEraser = false
      this.ctx.globalCompositeOperation = 'source-over'
    },
    // 获取X坐标
    getMouseX (e) {
      return e.clientX - this.canvas.getBoundingClientRect().left
    },
    // 获取Y坐标
    getMouseY (e) {
      return e.clientY - this.canvas.getBoundingClientRect().top
    },
    // 撤销
    undo () {
      if (this.drawingStack.length > 0) {
        // 撤销画笔的路径
        if (this.isDrawing) {
          this.drawingStack.pop()
        }
        // 撤销橡皮擦的路径
        if (this.isErasing) {
          this.eraserStack.pop()
        }
        this.clearCanvas()
        this.redrawPaths()
      }
    },
    // 清空
    clearCanvas () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    },
    redrawPaths () {
      // this.baseCanvas()

      // 重新绘制画笔的路径
      this.drawingStack.forEach((path) => {
        this.drawPath(path, 'blue')
      })

      // 重新绘制橡皮擦的路径
      this.eraserStack.forEach((path) => {
        this.drawPath(path, 'white') // 使用橡皮擦的颜色
      })
    },
    drawPath (path, color) {
      for (let i = 1; i < path.length; i++) {
        this.ctx.beginPath()
        this.ctx.moveTo(path[i - 1].x, path[i - 1].y)
        this.ctx.lineTo(path[i].x, path[i].y)
        this.ctx.strokeStyle = color
        this.ctx.stroke()
      }
    },
    // 重绘
    // redrawPaths () {
    //   this.drawingStack.forEach((path) => {
    //     this.ctx.beginPath()
    //     for (let i = 1; i < path.length; i += 2) {
    //       this.ctx.moveTo(path[i - 1].x, path[i - 1].y)
    //       this.ctx.lineTo(path[i].x, path[i].y)
    //       if (path[i].isDrawing) {
    //         // 如果是画笔的点，使用画笔颜色
    //         this.ctx.strokeStyle = 'blue'
    //       } else {
    //         // 如果是橡皮擦的点，使用背景颜色
    //         this.ctx.strokeStyle = 'white' // 假设背景是白色
    //       }
    //     }
    //     this.ctx.stroke()
    //   })
    // },
    toggleEraser () {
      this.eraserMode = !this.eraserMode
    }
  }
}
</script>
<style lang="scss">
.canvas {
  border: 1px solid #000;
  background-image: url("https://qsh-cdn.bj.bcebos.com/achievements/admin/%E7%AC%AC%E4%B8%80%E5%90%8D.png");
  background-repeat: no-repeat;
  background-size: 20%;
  background-position: 50%;
}
</style>
