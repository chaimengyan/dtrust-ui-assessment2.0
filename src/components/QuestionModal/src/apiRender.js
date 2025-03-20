import { h, createApp, } from 'vue';
import { uniqueId } from 'lodash-es';

/**
 * api 声明式组件
 */
export default class ApiRender {
  static render(config) {
    const { comp, props = {}, slots = {}, isOverride = true, name = '', target } = config;
    
    // const name = isAccumulate ? comp.__name + uniqueId() : comp.__name;
    const el = document.getElementById(name);
    if (el && !isOverride) {
      return;
    }
    const inner = ApiRender.createInsertContainer(el, name, target);

    const currentComp = h(comp, ApiRender.buildProps(props), slots);
    return createApp(currentComp).mount(inner)
  }

  static createInsertContainer(el, className, target) {
    if (el) {
      el.parentNode.removeChild(el);
    }
    const container = document.createElement('div');
    container.id = className;
    const t = target ? document.querySelector(target) : document.body;
    t.appendChild(container);

    return container;
  }

  static buildProps(props) {
    return props;
  }
}
