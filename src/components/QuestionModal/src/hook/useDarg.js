export function useDarg(el, containerEl, cb, interceptor, onDown) {
  let dom = { value: '' };
  let isDarg = false;
  let rect = {
    left: 0,
    top: 0,
    originFX: 0,
    originFY: 0,
    maxX: 0,
    maxY: 0,
    targetW: 0,
    targetH: 0
  }

  mounted();

  function mounted() {
    setTimeout(() => {
      dom.value = document.querySelector(el)
      if (!dom.value) {
        return
      }
      setTimeout(init);
    })
  }

  function unMount() {
    mouseup();
    dom.value.removeEventListener('mousedown', mousedown)
  }

  function init() {
    const { width, height } = document.documentElement.getBoundingClientRect()
    const container = document.querySelector(containerEl)
    if (container) {
      const { width: w, height: h } = container.getBoundingClientRect()
      rect.targetW = w
      rect.targetH = h
    }
    rect.maxX = width
    rect.maxY = height
    dom.value.addEventListener('mousedown', mousedown)
  }


  function mousedown(e) {
    rect.left = e.layerX
    rect.top = e.layerY
    rect.originFX = e.pageX
    rect.originFY = e.pageY
    isDarg = true
    document.documentElement.style.userSelect = 'none';
    window.addEventListener('mousemove', mousemove)
    window.addEventListener('mouseup', mouseup)
    onDown && onDown()
  }

  function mousemove(e) {
    if (isDarg && (!interceptor || interceptor())) {
      const { maxX, maxY, targetW, targetH, originFX, originFY } = rect
      const left = e.pageX - rect.left
      const top = e.pageY - rect.top

      const x = left <= 0 ? 0 : left + targetW >= maxX ? (maxX - targetW) : left
      const y = top <= 0 ? 0 : top + targetH >= maxY ? (maxY - targetH) : top

      // x left距离
      // y top距离
      // x 起点和终点距离
      // y 起点和终点距离
      cb && cb(x, y, originFX - e.pageX, originFY - e.pageY);
    }
  }
  function mouseup() {
    isDarg = false
    window.removeEventListener('mousemove', mousemove)
    window.removeEventListener('mouseup', mouseup)
    document.documentElement.style.userSelect = 'auto';
  }

  return {
    init,
    mounted,
    unMount
  }
}
