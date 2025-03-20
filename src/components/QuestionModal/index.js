import { ComponentInternalInstance } from 'vue';
import apiRender from './src/apiRender'

import QuestionModal from './src/QuestionModal.vue'

let modal = undefined;
export default QuestionModal

export function start(props, slots = {}) {
  const target = '#app'
  if (!modal) {
    modal = apiRender.render({
      comp: QuestionModal,
      name: 'QuestionModal',
      props: {
        target,
        ...props
      },
      slots,
      isOverride: false,
    })
  }
  // @ts-ignore
  modal?.start(target)
}
