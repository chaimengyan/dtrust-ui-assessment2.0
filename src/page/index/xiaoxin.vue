<template>
  <div
    class="floating-qa-button"
    :style="buttonStyle"
    @mousedown="startDrag"
    @touchstart="startDrag"
    ref="button"
  >
    <button class="qa-button" @click="toggleQa">
      <span v-if="!isOpen">
        <img src="/img/MaxKB.gif" height="32px" width="32px">
      </span>
      <span v-else>信</span>
    </button>
    
  
  </div>
</template>

<script>
export default {
  name: 'FloatingQaButton',
  data() {
    return {
      isOpen: false,
      isDragging: false,
      startX: 0,
      startY: 0,
      startLeft: 0,
      startTop: 0,
      currentLeft: null,
      currentTop: null,
      questions: [
        { q: '如何注册账号?', a: '点击首页右上角的注册按钮，填写相关信息即可完成注册。', showAnswer: false },
        { q: '忘记密码怎么办?', a: '在登录页面点击"忘记密码"，按照提示操作即可重置密码。', showAnswer: false },
        { q: '如何联系客服?', a: '您可以通过在线客服或拨打400-123-4567联系我们的客服团队。', showAnswer: false }
      ]
    };
  },
  computed: {
    buttonStyle() {
      return {
        left: this.currentLeft !== null ? `${this.currentLeft}px` : 'auto',
        top: this.currentTop !== null ? `${this.currentTop}px` : 'auto',
        right: this.currentLeft === null ? '20px' : 'auto',
        bottom: this.currentTop === null ? '20px' : 'auto'
      };
    }
  },
  mounted() {
    window.addEventListener('mousemove', this.handleDrag);
    window.addEventListener('touchmove', this.handleDrag);
    window.addEventListener('mouseup', this.stopDrag);
    window.addEventListener('touchend', this.stopDrag);
  },
  beforeDestroy() {
    window.removeEventListener('mousemove', this.handleDrag);
    window.removeEventListener('touchmove', this.handleDrag);
    window.removeEventListener('mouseup', this.stopDrag);
    window.removeEventListener('touchend', this.stopDrag);
  },
  methods: {
    toggleQa() {
        
          const chatRef = this.$store.state.common.chat
          console.log(chatRef,'chatRef');
          chatRef.start()
          chatRef.setAicontent({real: '', surface: ''}, 'chat', null, null)
      
    },
    toggleAnswer(index) {
      this.questions[index].showAnswer = !this.questions[index].showAnswer;
    },
    startDrag(e) {
      // 如果是点击按钮，不触发拖拽
      if (e.target.classList.contains('qa-button')) return;
      
      this.isDragging = true;
      
      // 获取初始位置
      const rect = this.$refs.button.getBoundingClientRect();
      this.startLeft = rect.left;
      this.startTop = rect.top;
      
      // 记录鼠标/触摸起始位置
      if (e.type === 'mousedown') {
        this.startX = e.clientX;
        this.startY = e.clientY;
      } else {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
      }
      
      e.preventDefault();
    },
    handleDrag(e) {
      if (!this.isDragging) return;
      
      let clientX, clientY;
      
      if (e.type === 'mousemove') {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
      
      // 计算新位置
      const newLeft = this.startLeft + (clientX - this.startX);
      const newTop = this.startTop + (clientY - this.startY);
      
      // 限制在视窗范围内
      const maxX = window.innerWidth - this.$refs.button.offsetWidth;
      const maxY = window.innerHeight - this.$refs.button.offsetHeight;
      
      this.currentLeft = Math.max(0, Math.min(newLeft, maxX));
      this.currentTop = Math.max(0, Math.min(newTop, maxY));
    },
    stopDrag() {
      this.isDragging = false;
    }
  }
};
</script>

<style scoped>
.floating-qa-button {
  position: fixed;
  z-index: 9999;
}

.qa-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #42b983;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.qa-button:hover {
  background-color: #3aa876;
  transform: scale(1.1);
}

.qa-panel {
  position: absolute;
  right: 0;
  bottom: 60px;
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.qa-header {
  padding: 12px 16px;
  background-color: #42b983;
  color: white;
  font-weight: bold;
}

.qa-content {
  max-height: 400px;
  overflow-y: auto;
}

.qa-item {
  border-bottom: 1px solid #eee;
}

.question {
  padding: 12px 16px;
  cursor: pointer;
  font-weight: 500;
}

.question:hover {
  background-color: #f5f5f5;
}

.answer {
  padding: 8px 16px 16px;
  background-color: #f9f9f9;
  color: #555;
  font-size: 14px;
}
</style>