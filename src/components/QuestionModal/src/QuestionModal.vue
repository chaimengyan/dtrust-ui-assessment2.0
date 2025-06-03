<template>
  <div class="question-modal" :class="{ show }" :style="rectContainerStyle">
    <div class="question-body">
    <div class="question-modal-content" :class="{ show: showContent, hide: !showContent }" :style="rectStyle" @animationend="onClose">
      
      <div class="question-header" :class="{ ['right-fixed']: fixed }">
        <div class="chatTitle">
          <div class="title-icon">
            信
          </div>
          {{chatTitle}}</div>
        <div class="flex">
          <div class="icon" @click="handleFixed">
            <!-- <el-icon><FullScreen /></el-icon> -->
            <i class="el-icon-full-screen"></i>
          </div>
          <div class="icon" @click="hide">
            <!-- <el-icon><Close /></el-icon> -->
            <i class="el-icon-close"></i>
          </div>
        </div>
      </div>
      <div class="question-content">
        <slot></slot>
      </div>

      <div class="point p1" :class="{ ['right-fixed']: fixed }"></div>
      <div class="point p2" :class="{ ['right-fixed']: fixed }"></div>
      <div class="point p3" :class="{ ['right-fixed']: fixed }"></div>
      <div class="line l1" :class="{ ['right-fixed']: fixed }"></div>
      <div class="line l2" :class="{ ['right-fixed']: fixed }"></div>
      <div class="line l3"></div>
    </div>
  </div>
  </div>
</template>


<script>
import { useDarg } from './hook/useDarg'


export default {
  name: 'QuestionModal',
  props: {
    minWidth: {
        type: [Number, String],
        default: 240,
      },
      minHeight: {
        type: [Number, String],
        default: 400,
      },

      maxWidth: {
        type: [Number, String],
        default: '70%',
      },
      maxHeight: {
        type: [Number, String],
        default: 900,
      },
      defaultWidth: {
        type: [Number, String],
        default: 800,
      },
      defaultHeight: {
        type: [Number, String],
        default: 600,
      },
      containerMinWidth: {
        type: [Number, String],
        default: '50%',
      },
      chatTitle: {
        type: String,
        default: () => {
          return '小信助手'
        }
      }
  },
  data() {
    return {
      fixed: false,
      showContent: false,
      show: false,
      targetEl: '',
      oldRect: '',
      size: {},
      rect: { width: this.defaultWidth, height: this.defaultHeight, left: 0, top: 0 },
      // 记录实时大小信息，用来判断是否可以拖拽放大缩小
      r: { width: this.defaultWidth, height: this.defaultHeight, left: 0, top: 0 },
      clearDragFuncs: [],
    }
  },
  mounted() {
    const { unMount: unMount1 } = useDarg('.question-modal .question-header', '.question-modal .question-modal-content', (x, y) => {
        this.removeAnimation()
        this.rect.left = x
        this.rect.top = y
        this.resetRect()
    }, () => !this.fixed);

    const { unMount: unMount2 } = useDarg('.question-modal .point.p1', null, this.p1, () => !this.fixed, this.resetRect);
    const { unMount: unMount3 } = useDarg('.question-modal .point.p2', null, this.p2, () => !this.fixed, this.resetRect);
    const { unMount: unMount4 } = useDarg('.question-modal .point.p3', null, this.p3, () => !this.fixed, this.resetRect);

    const { unMount: unMount5 } = useDarg('.question-modal .line.l1', null, this.l1, () => !this.fixed, this.resetRect);
    const { unMount: unMount6 } = useDarg('.question-modal .line.l2', null, this.l2, () => !this.fixed, this.resetRect);
    const { unMount: unMount7 } = useDarg('.question-modal .line.l3', null, this.l3, () => true, this.resetRect);
    this.clearDragFuncs = [unMount1, unMount2, unMount3, unMount4, unMount5, unMount6, unMount7]
  },
  beforeDestroy() {
    this.clearDragFuncs.forEach(func => func());
    this.clearDragFuncs = [];
  },
  computed: {
    rectStyle() {
      return {
        width: this.rect.width + 'px',
        height: this.rect.height + 'px',
        transform: this.rect.transform,
        transition: this.rect.transition,
      }
    },
    rectContainerStyle() {
      return {
          left: this.rect.left + 'px',
          top: this.rect.top + 'px',
          transition: this.rect.transition,
        }
    }
  },
  methods: {
    start(target) {
      if (!target) {
        target = '#app';
      }
      window.removeEventListener('resize', this.resizeRect)
      window.addEventListener('resize', this.resizeRect)
      this.resizeRect(target);
      setTimeout(() => {
        this.show = true
        setTimeout(() => {
          this.showContent = true
        })
      })

    },
    resizeRect(target) { 
      this.setSize();
      if (this.fixed) {
        this.setFixed();
      } else {
        this.init(target);
      }
    },
    hasPercentage(value) {
      return value.toString().includes('%')
    },
    setSize() {
      this.size = {
        maxWidth: this.hasPercentage(this.maxWidth) ? this.cale(this.maxWidth) : parseInt(this.maxWidth),
        minWidth: this.hasPercentage(this.minWidth) ? this.cale(this.minWidth) : parseInt(this.minWidth),
        maxHeight: this.hasPercentage(this.maxHeight) ? this.cale(this.maxHeight, false) : parseInt(this.maxHeight),
        minHeight: this.hasPercentage(this.minHeight) ? this.cale(this.minHeight, false) : parseInt(this.minHeight),
        containerMinWidth: this.hasPercentage(this.containerMinWidth) ? this.cale(this.containerMinWidth) : parseInt(this.containerMinWidth),
      }
    },
    cale(value, isWidth = true) {
      const v = value.replace('%', '')
      const docVal = isWidth ? document.documentElement.clientWidth : document.documentElement.clientHeight
      return docVal * (parseInt(v) / 100)
    },
    handleFixed() {
      if (!this.targetEl) return;
      this.fixed = !this.fixed
      if (!this.fixed) {
        return this.init()
      }
      this.oldRect = { ...this.rect }
      this.setFixed()
    },
    setFixed() {
      this.setTargetAttr(document.documentElement.clientWidth - this.defaultWidth);
      this.setRect({
        left: document.documentElement.clientWidth - this.defaultWidth,
        top: 0,
        width: this.defaultWidth,
        height: this.targetEl.clientHeight,
      })
      this.setAnimation()
    },
    hide() {
      this.showContent = false
    },
    onClose() {
      if (!this.showContent) {
        this.show = this.showContent
        this.setTargetAnimation();
        this.setTargetAttr(document.documentElement.clientWidth);
      }
    },
    init(target) {
      this.setRect(this.oldRect ? { ...this.oldRect } : this.getDefaultSize())
      this.setAnimation();
      if (!this.targetEl) {
        this.targetEl = document.querySelector(target)
        this.setTargetAnimation();
      }
      this.setTargetAttr(document.documentElement.clientWidth);
    },
    setTargetAnimation() {
      this.targetEl.style.transition = 'width .25s'
    },
    removeTargetAnimation() {
      this.targetEl.style.transition = undefined
    },
    getDefaultSize() {
      const { width, height } = document.documentElement.getBoundingClientRect()
      return {
        left: (width - this.defaultWidth) / 2,
        top: (height - this.defaultHeight) / 2,
        width: this.defaultWidth,
        height: this.defaultHeight
      }
    },
    setRect(data) {
      this.rect = data;
      Object.assign(this.r, { ...data })
    },
    resetRect() {
      this.setRect(this.rect)
    },
    setTargetAttr(width) {
      this.targetEl.style.width = width + 'px'
    },
    p3(x, y, fx, fy) {

      const containerW = document.documentElement.clientWidth - this.rect.width

      const [rfx, rsw] = this.getResizeSize(fx, '', () => this.r.width + fx, (w) => w - this.r.width)
      const [, rsh] = this.getResizeSize(fy, 'h',() => this.r.height - fy)

      this.rect.width = rsw
      this.rect.height = rsh
      this.rect.left = this.r.left - rfx

      if (this.fixed && containerW > this.size.containerMinWidth) {
        this.removeTargetAnimation()
        this.setTargetAttr(containerW)
      }
    },
    p2(x, y, fx, fy) {
      const [, rsw] = this.getResizeSize(fx, '', () => this.r.width - fx)
      const [, rsh] = this.getResizeSize(fy, 'h', () => this.r.height - fy)
      this.rect.width = rsw
      this.rect.height = rsh
    },
    p1(x, y, fx, fy) {

      const [, rsw] = this.getResizeSize(fx, '', () => this.r.width - fx)
      const [rfy, rsh] = this.getResizeSize(fy, 'h', () => this.r.height + fy, (h) => h - this.r.height)

      this.rect.width = rsw
      this.rect.height = rsh
      this.rect.top = this.r.top - rfy
    },
    l1(x, y, fx) {
      this.p1(x, y, fx, 0)
    },
    l2(x, y, fx, fy) {
      this.p2(x, y, 0, fy)
    },
    l3(x, y, fx) {
      this.p3(x, y, fx, 0)
    },
    setAnimation() {
      this.rect.transition = 'all .35s'
    },
    removeAnimation() {
      this.rect.transition = undefined
    },
    getResizeSize(fy, attr, cb, fcb) {
      this.removeAnimation()
      const isHeight = attr === 'h'
      const [a1, a2] = isHeight ? ['minHeight', 'maxHeight'] : ['minWidth', 'maxWidth']
      let h = cb()
      if (this.fixed && isHeight) {
        return [0, this.rect.height]
      }
      if (h <= this.size[a1]) {
        h = this.size[a1]
      }
      if (h >= this.size[a2]) {
        h = this.size[a2]
      }
      fy = fcb ? fcb(h) : 0
      return [fy, h]
    }
  }
}
</script>
<style lang="scss" scoped>
.question-modal {
  display: none;
  position: fixed;
  z-index: 6000;

  .flex {
    display: flex;
    align-items: center;
  }

  &.show {
    display: block;
  }
  .question-body {
    display: flex;
    box-shadow: 0 0 16px 0 rgba(0,0,0,0.16);
    border-radius: 8px;
  .question-modal-content {
    position: relative;
    background-color: #fff;
    border: 1px solid #e3e4e6;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    .question-content {
      flex: 1;
      height: 0;
    }

    &.show {
      animation: ani-show .25s;
    }
    &.hide {
      animation: ani-hide .25s;
    }

    .question-header {
      height: 34px;
      padding: 0 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #f4f6f7;
      cursor: move;
      border-radius: 10px;
      margin: 8px;
      .chatTitle {
        display: flex;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        align-items: center;
        .title-icon {
          margin: 4px;
          padding: 4px 6px;
          color: #eff2f6;
          background-color: #888bff;
          border-radius: 4px;
          font-size: 12px;
        }
      }
    }

    .right-fixed {
      cursor: unset !important;
    }

    .icon {
      color: #666;
      transition: 0.25s;
      cursor: pointer;
      padding: 0 4px;
      border-radius: 4px;
      font-size: 14px;

      &:hover {
        color: #333;
        background-color: #eee;
      }
    }

    .point {
      position: absolute;
      width: 20px;
      height: 20px;
      z-index: 200;
      &.p1 {
        right: 0;
        top: 0;
        transform: translate(50%, -50%);
        cursor: ne-resize;
      }
      &.p2 {
        right: 0;
        bottom: 0;
        transform: translate(50%, 50%);
        cursor: se-resize;
      }
      &.p3 {
        left: 0;
        bottom: 0;
        transform: translate(-50%, 50%);
        cursor: ne-resize;
      }
    }

    .line {
      position: absolute;
      width: 10px;
      height: 100%;
      background-color: transparent;
      &.l1 {
        right: 0;
        top: 0;
        transform: translateX(50%);
        cursor: col-resize;
      }
      &.l2 {
        height: 10px;
        width: 100%;
        left: 0;
        bottom: 0;
        transform: translateY(50%);
        cursor: row-resize;
      }
      &.l3 {
        left: 0;
        top: 0;
        transform: translateX(-50%);
        cursor: col-resize;
      }
    }
  }
}
}


@keyframes ani-show {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes ani-hide {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
