<template>
  <div class="avue-sidebar">
    <logo></logo>
    <el-scrollbar view-style="font-weight: bold;height:100%;" :native="false">
      <div v-if="validatenull(menu)" class="avue-sidebar--tip">
        没有发现菜单
      </div>
      <el-menu
        :default-active="nowTagValue"
        mode="vertical"
        :show-timeout="200"
        :collapse="keyCollapse"
        :default-openeds="defaultOpeneds"
      >
        <sidebar-item
          :menu="menu"
          :screen="screen"
          first
          :props="website.menu.props"
          :collapse="keyCollapse"
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
    <div class="open-siderbar" @click="setCollapse">
      <template v-if="keyCollapse">
        <i class="el-icon-d-arrow-right"></i>
      </template>
       <template v-else>
        <i class="el-icon-d-arrow-left"></i>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import logo from "../logo";
import sidebarItem from "./sidebarItem";

export default {
  name: "sidebar",
  components: { sidebarItem, logo },
  data() {
    return {};
  },
  created() {
    
  },
  computed: {
    ...mapGetters(["website", "menu", "tag", "keyCollapse", "screen"]),
    defaultOpeneds: function() {
      return this.menu.map(i => (i.path))
    },
    nowTagValue: function() {
      return this.$router.$avueRouter.getValue(this.$route);
    }
  },
  mounted() {},
  methods: {
    setCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-scrollbar__view::-webkit-scrollbar { width: 0 !important }
.open-siderbar {
  color: #b6b3b3;
  text-align: left;
  // font-size: 12px;
  margin-top: 40px;
  margin-left: 20px;
}

</style>
