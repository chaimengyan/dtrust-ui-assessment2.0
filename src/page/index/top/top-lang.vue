<template>
  <el-dropdown trigger="click"
               @command="handleSetLanguage">
    <i class="icon-ty-zhongyingwen"></i>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="language==='zh-cn'"
                          command="zh-cn">中文</el-dropdown-item>
        <el-dropdown-item :disabled="language==='en'"
                          command="en">English</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { mapGetters } from "vuex";
import {changeLanguage} from "@/api/admin/menu.js"
export default {
  name: "top-lang",
  data () {
    return {};
  },
  created () { },
  mounted () { 
    const l = this.userInfo.language === 'ZH_CN' ? 'zh-cn' : 'en'
    this.$i18n.locale = l
    this.$store.commit("SET_LANGUAGE", l);
    let tag = this.tag;
    let title = this.$router.$avueRouter.generateTitle(tag);
    //根据当前的标签也获取label的值动态设置浏览器标题
    this.$router.$avueRouter.setTitle(title);
  },
  computed: {
    ...mapGetters(["language", "tag", 'userInfo'])
  },
  props: [],
  methods: {
    handleSetLanguage (lang) {//zh-cn  en
      const lg = lang === 'zh-cn' ? 'ZH_CN' : 'EN'
      changeLanguage(lg).then(res=> {
        this.$i18n.locale = lang;
        this.$store.commit("SET_LANGUAGE", lang);
        let tag = this.tag;
        let title = this.$router.$avueRouter.generateTitle(tag);
        //根据当前的标签也获取label的值动态设置浏览器标题
        this.$router.$avueRouter.setTitle(title);
        window.location.reload();
      })
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
