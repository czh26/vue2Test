<template>
  <div>
    <div id="wrap" class="wrap">
      <div>
        <button @click="listenerStatus = 'pencil'">使用画笔</button>
        <button @click="listenerStatus = 'eraser'">使用橡皮擦</button>
        <button @click="undo()">撤销</button>
        <button @click="redo()">重做</button>
        <button @click="clear()">清空</button>
        <button @click="inputText()">输入文字</button>
        <button @click="save()">保存</button>
        <button @click="applyClipPath()">裁剪</button>
        <select v-model="lineWidth" style="width: 50px; height: 30px">
          <option
            v-for="item in lineSize"
            :key="item"
            :label="item"
            :value="item"
          ></option>
        </select>
        <input type="file" id="fileInput" accept="image/*" @change="base64" />
      </div>
      <canvas
        class="canvas"
        ref="myCanvas"
        width="1300"
        height="730"
        @mousedown="listenerDown"
        @mousemove="listenerMove"
        @mouseup="listenerUp"
      ></canvas>
    </div>
  </div>
</template>

<script>
import { point1, point2 } from './point'
export default {
  name: 'DrawLine',
  data () {
    return {
      ctx: null,
      wrap: null,
      bgCtx: null,
      canvas: null,
      bgCanvas: null,
      isDrawing: false,
      isDragging: false,
      eraserMode: false,
      isEraser: false,
      drawingStack: [],
      currentPath: [],
      redoHistory: [],
      eraserStack: [],
      lineSize: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      lastX: 0,
      lastY: 0,
      textX: 0,
      textY: 0,
      textWidth: 0,
      textHeight: 0,
      listenerStatus: 'pencil',
      strokeStyle: 'red',
      fillStyle: 'red',
      lineWidth: 3,
      currentNum: 0,
      paths: []
    }
  },
  watch: {
    lineWidth (newVal) {
      this.ctx.lineWidth = newVal
    },
    fillStyle (newVal) {
      this.ctx.fillStyle = newVal
    },
    strokeStyle (newVal) {
      this.ctx.strokeStyle = newVal
    }
  },
  mounted () {
    this.initializeCanvas()
  },
  methods: {
    // 应用路径作为裁剪路径
    applyClipPath () {
      // 是否为开头
      let isFirstPath = true
      // 开始路径
      this.ctx.beginPath()
      // 从数组中获取路径并创建裁剪路径
      this.paths.forEach((point, index) => {
        if (point.x === -1 && point.y === -1) {
          // 如果遇到断开路径的指令，则不绘制，直接返回
          isFirstPath = true
          return
        }
        if (isFirstPath) {
          this.ctx.moveTo(point.x, point.y)
          isFirstPath = false
        } else {
          this.ctx.lineTo(point.x, point.y)
        }
      })
      // 封闭路径
      this.ctx.closePath()
      this.ctx.stroke()
      // 应用裁剪路径
      this.ctx.clip()
    },
    // 转为base64
    base64 (e) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = function (e) {
        const base64String = e.target.result
        console.log('Base64:', base64String)
      }
      reader.readAsDataURL(file)
    },
    // 初始化画板
    initializeCanvas () {
      this.canvas = this.$refs.myCanvas
      this.ctx = this.canvas.getContext('2d')
      this.ctx.imageSmoothingEnabled = true
      this.ctx.strokeStyle = this.strokeStyle
      this.ctx.fillStyle = this.fillStyle
      this.ctx.lineWidth = this.lineWidth
      this.drawingStack.push(this.canvas.toDataURL())
      // // 定义裁剪路径
      // const clipPath = new Path2D('M 50 50 L 250 50 L 250 250 L 50 250 Z')
      // // 应用裁剪路径
      // this.ctx.clip(clipPath)

      this.paths.push(...point1)
      // 添加断开路径的指令
      this.paths.push({ x: -1, y: -1 })
      this.paths.push(...point2)
      this.applyClipPath()

      console.log(point1, point2)

      // const img = new Image()
      // img.onload = () => {
      //   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      //   this.ctx.save()
      //   this.ctx.translate(0, 0)
      //   this.ctx.rotate(-Math.PI / 2)
      //   this.ctx.drawImage(img, -730, 0, 730, 1300)
      //   this.ctx.restore()

      //   // 计算缩放比例
      //   // const scaleX = this.canvas.width / img.width // 假设原始图形的宽度为 400px
      //   // const scaleY = this.canvas.height / img.height // 假设原始图形的高度为 300px
      //   // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      //   // this.ctx.scale(scaleX, scaleY)
      //   // this.ctx.drawImage(img, 0, 0, 1300, 730)
      // }
      // img.src = this.imgurl
    },
    // 监听鼠标落下
    listenerDown (e) {
      if (this.listenerStatus === 'pencil') {
        this.strokeStyle = 'red'
        this.fillStyle = 'red'
        this.ctx.globalCompositeOperation = 'source-over'
        this.drawPencilDown(e)
      } else if (this.listenerStatus === 'eraser') {
        this.ctx.globalCompositeOperation = 'destination-out'
        this.drawEraserDown(e)
      } else if (this.listenerStatus === 'text') {
        this.ctx.globalCompositeOperation = 'source-over'
        this.drawTextDown(e)
      }
    },
    // 监听鼠标移动
    listenerMove (e) {
      if (this.listenerStatus === 'pencil') {
        this.drawPencilMove(e)
      } else if (this.listenerStatus === 'eraser') {
        this.drawEraserMove(e)
      } else if (this.listenerStatus === 'text') {
        this.drawTextMove(e)
      }
    },
    // 监听鼠标抬起
    listenerUp (e) {
      if (this.listenerStatus === 'pencil') {
        this.drawPencilUp(e)
      } else if (this.listenerStatus === 'eraser') {
        this.drawEraserUp(e)
      } else if (this.listenerStatus === 'text') {
        this.drawTextUp(e)
      }
    },
    // 铅笔落下
    drawPencilDown (e) {
      // e.preventDefault()

      this.ctx.lineJoin = 'round'
      this.ctx.lineCap = 'round'
      this.isDrawing = true
      // 记录初始位置
      this.lastX = this.getMouseX(e)
      this.lastY = this.getMouseY(e)

      this.ctx.beginPath()
      this.ctx.arc(
        this.getMouseX(e),
        this.getMouseY(e),
        3 / 2,
        0,
        Math.PI * 2,
        true
      )
      this.ctx.closePath()
      this.ctx.fill()

      this.ctx.beginPath()
      this.ctx.moveTo(this.getMouseX(e), this.getMouseY(e))
    },
    // 铅笔移动
    drawPencilMove (e) {
      if (!this.isDrawing) return
      const controlX = (this.lastX + this.getMouseX(e)) / 2
      const controlY = (this.lastY + this.getMouseY(e)) / 2
      // 使用二次贝塞尔曲线绘制
      this.ctx.quadraticCurveTo(this.lastX, this.lastY, controlX, controlY)
      // this.ctx.lineTo(this.getMouseX(e), this.getMouseY(e))
      this.ctx.stroke()
      this.lastX = controlX
      this.lastY = controlY
      // 将绘制路径保存到数组中
      this.paths.push({ x: this.lastX, y: this.lastY })
    },
    // 铅笔抬起
    drawPencilUp (e) {
      if (this.isDrawing) {
        this.drawingStack.splice(this.currentNum + 1)
        this.drawingStack.push(this.canvas.toDataURL())
        this.currentNum = this.drawingStack.length - 1
      }
      this.isDrawing = false
    },
    // 橡皮落下
    drawEraserDown (e) {
      this.ctx.save()
      this.drawPencilDown(e)
    },
    // 橡皮移动
    drawEraserMove (e) {
      this.drawPencilMove(e)
    },
    // 橡皮抬起
    drawEraserUp (e) {
      this.drawPencilUp(e)
      this.ctx.restore()
    },
    // 输入框落下
    drawTextDown (e) {
      this.isDragging = true

      this.wrap = document.getElementById('wrap')
      if (this.wrap.querySelector('textarea')) {
        // 移除已经画好的输入框
        this.wrap.removeChild(this.textarea)
        // 绘制输入框内的文字
        this.drawWrappedText(
          this.textarea.value,
          this.textX + 2,
          this.textY + 19,
          this.textWidth,
          24
        )
      }
      this.textX = this.getMouseX(e)
      this.textY = this.getMouseY(e)

      // 创建 textarea 元素
      this.textarea = document.createElement('textarea')
      this.textarea.className = 'textarea'
      this.textarea.style.backgroundColor = 'transparent'
      this.textarea.rows = 1
      this.textarea.cols = 30
      this.textarea.placeholder = '请输入文本...'
    },
    // 输入框移动
    drawTextMove (e) {
      if (!this.isDragging) return
      this.textWidth = this.getMouseX(e) - this.textX - 10
      this.textHeight = this.getMouseY(e) - this.textY - 10
      this.drawTextArea(e)
    },
    // 输入框抬起
    drawTextUp (e) {
      this.isDragging = false
    },
    // 画文本框
    drawTextArea (e) {
      // 反着画时
      if (this.textWidth < 0) {
        this.textWidth = 0 - this.textWidth
        this.textarea.style.left = this.getMouseX(e) + 10 + 'px'
      } else {
        this.textarea.style.left = this.textX + 'px'
      }
      if (this.textHeight < 0) {
        this.textHeight = 0 - this.textHeight
        this.textarea.style.top = this.getMouseY(e) + 10 + 'px'
      } else {
        this.textarea.style.top = this.textY + 'px'
      }
      this.textarea.style.width = this.textWidth + 'px'
      this.textarea.style.height = this.textHeight + 'px'
      if (this.wrap.querySelector('textarea')) {
        this.wrap.removeChild(this.textarea)
      }
      this.wrap.appendChild(this.textarea)
    },
    // 撤销
    undo () {
      this.ctx.globalCompositeOperation = 'source-over'
      if (this.currentNum > 0) {
        this.currentNum -= 1
      } else {
        console.log('撤销到头了')
      }
      const img = new Image()
      img.onload = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.drawImage(img, 0, 0)
      }
      img.src = this.drawingStack[this.currentNum]
      // this.drawingStack.splice(this.currentNum + 1)
    },
    // 重做
    redo () {
      this.ctx.globalCompositeOperation = 'source-over'
      if (this.currentNum < this.drawingStack.length - 1) {
        this.currentNum += 1
      } else {
        console.log('恢复到头了')
        return
      }
      const img = new Image()
      img.onload = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.ctx.drawImage(img, 0, 0)
      }
      img.src = this.drawingStack[this.currentNum]
    },
    // 清空
    clear () {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.drawingStack = []
      this.drawingStack.push(this.canvas.toDataURL())
      this.currentNum = 0
    },
    // 输入文字
    inputText () {
      this.listenerStatus = 'text'
      // this.ctx.fillText('测试', 200, 200)
    },
    // 把输入的文字用canvas画出来(设置宽度自动换行)
    drawWrappedText (text, x, y, maxWidth, lineHeight) {
      this.ctx.save()
      const fontSize = 16
      const fontFamily = '微软雅黑'
      this.ctx.font = fontSize + 'px ' + fontFamily
      const words = text.split('')
      let line = ''
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ''
        const metrics = this.ctx.measureText(testLine)
        const testWidth = metrics.width
        if (testWidth > maxWidth && n > 0) {
          this.ctx.fillText(line, x, y)
          line = words[n] + ''
          y += lineHeight
        } else {
          line = testLine
        }
      }
      this.ctx.fillText(line, x, y)
      this.ctx.restore()
    },
    // 获取X坐标
    getMouseX (e) {
      return e.clientX - this.canvas.getBoundingClientRect().left
    },
    // 获取Y坐标
    getMouseY (e) {
      return e.clientY - this.canvas.getBoundingClientRect().top
    }
  }
}
</script>
<style lang="scss">
.wrap {
  width: 1300px;
  height: 730px;
  margin: 0 auto;
  position: relative;
  .textarea {
    position: absolute;
    z-index: 9;
  }
  .canvas {
    border: 1px solid #000;
    background-image: url("https://qsh-cdn.bj.bcebos.com/xjmy/admin/horseInfo/apperence.svg");
    background-size: 100% 100%;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 2;
  }
}
</style>
