import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Store from '@/store'
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'
import enLocale from './en'
import zhLocale from './zh'
import AvueEnLocale from '@smallwei/avue/lib/locale/lang/en'
import AvueZhLocale from '@smallwei/avue/lib/locale/lang/zh'

Vue.use(VueI18n)

export const messages = {
  en: {
    ...enLocale,
    ...AvueEnLocale,
    ...elementEnLocale
  },
  'zh-cn': {
    ...zhLocale,
    ...AvueZhLocale,
    ...elementZhLocale,
  },
}


export const language = Store.getters.language
const i18n = new VueI18n({
  locale: language, // 设置语言环境
  messages,
})
window.i18n = i18n
export default i18n;
