<template>
  <div class="avue-top">
    <div class="top-bar__left">
      <!-- logo -->
      <a href="/" target="_blank" class="logo">
        <img v-if="userInfo.logo" :src="userInfo.logo" alt="logo">
        <img v-else src="@/images/logo.png" alt="logo">
      </a>

      <!-- 公司名 -->
      <!-- <div style="font-size: 24px;margin: 0 10px;">
          <template v-if="userInfo.logo">
              <img style="width: 110px; height: 50px;" :src="userInfo.logo" alt="">
          </template>
          <template v-else>
              数之信
          </template>
      </div> -->

      <!-- 折叠菜单按钮 -->
      <!-- <div class="avue-breadcrumb"
           :class="[{ 'avue-breadcrumb--active': isCollapse }]"
           v-if="showCollapse">
        <i class="el-icon-s-operation"
           @click="setCollapse"></i>
      </div> -->

      <!-- 返回控制台按钮 -->
      <div style="display: flex; ">
        <!-- <el-tooltip
                  effect="dark"
                  content="工作流"
                  placement="bottom">
          <el-link
            style="margin-left:10px; font-size: 26px;"
            icon="el-icon-s-home"
            :underline="false"
            href="http://119.3.5.120:38888/"
            >
              <div style="font-size: 18px;">
                  工作流
              </div>
          </el-link>
        </el-tooltip> -->
        <el-tooltip effect="dark" :content="$t('navbar.工作流')">
          <el-link style="margin-left: 20px;margin-top: 10px;" target="_blank" :underline="false" :href="workFlowUrl">
            <el-button style="height: 32px;">
              <svg-icon icon-class="icon-trust" class="quick-list-icon"></svg-icon>{{$t('navbar.工作流')}}
            </el-button>
          </el-link>
        </el-tooltip>
      </div>
    </div>

    <div class="top-bar__title">
      <div class="top-bar__item top-bar__item--show"
           v-if="showMenu">
        <top-menu></top-menu>
      </div>
    </div>
    <div class="top-bar__right">

      <!-- 快捷应用 -->
      <div class="quick-list" v-for="item,index in quickList" :key="index">
        <el-tooltip effect="dark" :content="item.label">
          <el-link style="font-size: 12px" target="_blank" :underline="false" :href="item.href">
            <el-button circle v-if="item.value === 3">
              <div class="PIPL">
                PIPL
              </div>
            </el-button>
            <el-button circle v-else>
              <svg-icon :icon-class="item.icon" class="quick-list-icon"></svg-icon>
            </el-button>
          </el-link>
        </el-tooltip>
      </div>

      <!-- <el-tooltip effect="dark" :content="$t('crudCommon.添加')">
        <el-button circle style="margin-right: 10px;">
          <svg-icon icon-class="icon-plus-bold" class="quick-list-icon"></svg-icon>
        </el-button>
      </el-tooltip> -->

      <el-divider direction="vertical"></el-divider>

      <el-menu class="el-menu-demo" menu-trigger="hover" mode="horizontal">
        <el-submenu index="-1">
          <template slot="title">
            <i class="icon-ty-xitongguanli" style="font-size: 16px"/>
          </template>
          <MenuSelect :menus="moduleList"/>
        </el-submenu>
      </el-menu>

      <el-divider direction="vertical"></el-divider>

      <!-- <el-tooltip v-if="showLock"
                  effect="dark"
                  content="锁屏"
                  placement="bottom">
      </el-tooltip>
      <el-tooltip v-if="showFullScren"
                  effect="dark"
                  :content="isFullScreen?'退出全屏':'全屏'"
                  placement="bottom">
        <div class="top-bar__item">
          <i :class="isFullScreen?'icon-zuixiaohua':'icon-quanpingzuidahua'"
             @click="handleScreen"></i>
        </div>
      </el-tooltip> -->
      <el-tooltip 
        effect="dark"
        :content="$t('navbar.中英文')"
        placement="bottom">
        <top-lang></top-lang>
      </el-tooltip>

      <el-divider direction="vertical"></el-divider>

      <el-dropdown>
        <span class="el-dropdown-link">
          {{userInfo.nickName}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <template v-if="!(roles.includes(3)&&userInfo.tenantId===2)">
            <el-dropdown-item>
              <router-link to="/"><i class="el-icon-s-home"></i>{{$t('navbar.首页')}}</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link to="/info/index"><i class="el-icon-user-solid"></i>{{$t('navbar.个人信息')}}</router-link>
            </el-dropdown-item>
            <el-dropdown-item v-if="isShowAdimn">
              <el-link style="font-size: 12px" target="_blank" :underline="false" :href="adminUrl">
              <i class="el-icon-s-tools"></i>{{$t('navbar.访问控制')}}</el-link>
            </el-dropdown-item>
          </template>
          <el-dropdown-item 
            @click.native="logout"
            divided>
            <i class="el-icon-switch-button"></i>{{$t('navbar.退出系统')}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <template v-if="isDeptsEmpty()">
        <el-divider direction="vertical"></el-divider>
        <el-menu 
          class="el-menu-demo"
          active-text-color="#409EFF" 
          background-color="#ffffff" 
          menu-trigger="hover" 
          mode="horizontal">
            <el-submenu index="-1">
                <template slot="title">
                  {{ deptName }}
                </template>
                <DeptsSelect  @selectDepts="selectDepts" :depts="infoRest.dataPermissionDepts"/>
            </el-submenu>
        </el-menu>
      </template>
    </div>
  </div>
</template>
<script>
  import {mapGetters, mapState} from "vuex";
  import {fullscreenToggel, listenfullscreen} from "@/util/util";
  import topMenu from "./top-menu";
  import MenuSelect from './menu-select.vue'
  import DeptsSelect from './depts-select.vue'
  import {getAllMenu, checkAuthority} from '@/api/admin/menu'
  import topLang from "./top-lang.vue";
  import {isEmpty} from 'lodash'

  let locationUrl

  export default {
    components: {
      topMenu,
      MenuSelect,
      DeptsSelect,
      topLang
    },
    name: "top",
    data() {
      return {
        // workFlowUrl: `http://console.idatatrust.com/`,
        workFlowUrl: `http://116.205.172.167:38888/`,
        // adminUrl: `http://admin.idatatrust.com/`,
        adminUrl: `http://116.205.172.167:38081/`,
        moduleList: [],
        isShowAdimn: false,
        deptName: '',
        quickList: [
          {
            label: 'DPIA',
            value: 0,
            icon: 'icon-dpia',
            // href: `http://assess.idatatrust.com/#/assessment/questionnaireStart/index?typeIds=${29}`,
            href: `http://116.205.172.167:38080/#/assessment/questionnaireStart/index?typeIds=${29}`,
          },
          {
            label: this.$t('navbar.数据出境风险自评估'),
            value: 1,
            icon: 'icon-cjfxpg',
            // href: `http://assess.idatatrust.com/#/assessment/questionnaireStart/index?typeIds=${30}`,
            href: `http://116.205.172.167:38080/#/assessment/questionnaireStart/index?typeIds=${30}`,
          },
          {
            label: this.$t('navbar.数据跨境地图'),
            value: 2,
            icon: 'icon-map',
            // href: `http://assets.idatatrust.com/#/assetsCharts/earth/index`,
            href: `http://116.205.172.167:38082/#/assetsCharts/earth/index`,
          },
          {
            label: this.$t('navbar.PIPL'),
            value: 3,
            icon: '',
            // href: `http://assess.idatatrust.com/#/assessment/questionnaireStart/index?typeIds=${26}`,
            href: `http://116.205.172.167:38080/#/assessment/questionnaireStart/index?typeIds=${26}`,
          },
          {
            label: this.$t('navbar.网站APP小程序SDK合规评估'),
            value: 4,
            icon: 'icon-code',
            href: '',
          },
          {
            label: this.$t('navbar.自动化数据发现'),
            value: 5,
            icon: 'icon-compass',
            href: '',
          },
          {
            label: this.$t('navbar.数据处理活动记录RoPA'),
            value: 6,
            icon: 'icon-category',
            // href: `http://assets.idatatrust.com/#/assetsCharts/assetbusin/index`,
            href: `http://116.205.172.167:38082/#/assetsCharts/assetbusin/index`,
          },
        ],
      };
    },
    filters: {},
    created() {
      this.getAllMenu()
    },
    mounted() {
      this.isDeptsEmpty()&&(this.deptName = this.recursionDeptName(this.infoRest.dataPermissionDepts, this.userInfo.currentDept).name)
      listenfullscreen(this.setScreen);
    },
    computed: {
      ...mapState({
        showLock: state => state.common.showLock,
        showFullScren: state => state.common.showFullScren,
        showCollapse: state => state.common.showCollapse,
        showMenu: state => state.common.showMenu,
      }),
      ...mapGetters([
        "userInfo",
        "roles",
        "infoRest",
        "isFullScreen",
        "tagWel",
        "tagList",
        "isCollapse",
        "tag",
        "logsLen",
        "logsFlag"
      ])
    },
    methods: {
      recursionDeptName(depts, currentDept) {
        console.log(depts,"depteeee");
        for(let dept of depts || []) {
          if(dept.id === currentDept) return dept
          const dept_ = this.recursionDeptName(dept.children, currentDept)
          if(dept_) return dept_
        }
      },
      isDeptsEmpty() {
        return !isEmpty(this.infoRest.dataPermissionDepts)
      },
      selectDepts(item) {
        checkAuthority({userId: this.userInfo.userId, deptId: item.id}).then(res => {
            window.location.reload();
        })
      },
      getAllMenu() {
        getAllMenu().then(res => {
          if (res.data.data.length === 0) return;
          if(res.data.data.find(x => x.path.slice(0, 6) === '/admin') !== undefined) {
            this.isShowAdimn = true
          }
          this.addModules(res.data.data)
        })
      },
      // 添加其他系统模块
      addModules(menus) {
        // 根据外层path转 对象
        this.moduleList = [
          {
              id: 1,
              label: '评估及风险治理',
              path: '/assessment',
              // moduleHost: 'http://assets.idatatrust.com'
              moduleHost: 'http://116.205.172.167:38080'
          },
          {
              id: 2,
              label: '数据发现及映射',
              path: '/assets',
              // moduleHost: 'http://assets.idatatrust.com'
              moduleHost: 'http://116.205.172.167:38082'
          },
          {
              id: 3,
              label: '告知同意及主体权利',
              path: '/inform',
              // moduleHost: 'http://power.idatatrust.com'
              moduleHost: 'http://116.205.172.167:38083'
          },
        ]
        .map(item => {
            item.children = menus.filter(menu => menu.path.slice(0, item.path.length) === item.path)
            this.makeHost(item)

            return item
        })
        .filter(x => x.children.length !== 0)

        console.log(this.moduleList, 'm');
      },
      makeHost(data) {
        data.children.forEach(d => {
          d.moduleHost = data.moduleHost
          if(d.children&&d.children.length !== 0) {
            this.makeHost(d)
          }
        })
      },
      handleScreen() {
        fullscreenToggel();
      },
      setCollapse() {
        this.$store.commit("SET_COLLAPSE");
      },
      setScreen() {
        this.$store.commit("SET_FULLSCREN");
      },
      logout() {
        this.$confirm(this.$t('navbar.是否退出系统是否继续'), this.$t('crudCommon.提示'), {
                    confirmButtonText: this.$t('crudCommon.确定'),
                    cancelButtonText: this.$t('crudCommon.取消'),
          type: "warning"
        }).then(() => {
          this.$store.dispatch("LogOut").then(() => {
            // this.$router.push({path: "/login"});
            const path = window.location.hash.split('#')[1]
            if(window.location.host.match(RegExp(/com/))) {
              locationUrl = `http://console.idatatrust.com/#/login`
            }else {
              locationUrl = `${window.location.protocol}//${window.location.hostname}:38888/#/login`
            }
            window.name = `${window.location.origin}/#${path}`
            window.location.href = locationUrl
          });
        });
      }
    }
  };
</script>

<style lang="scss">
  .avue-top {
    .el-button--small {
      padding: 6px;
    }

    .el-submenu__title {
      padding: 0 0 0 10px;
    }
  }
</style>
<style lang="scss" scoped>
@import "../../../styles/mixins";

a.logo {
    display: block;
    height: 100%;

    img {
      width: auto;
      height: 30px;
      position: relative;
      display: block;
      top: 50%;
      @include transform(translateY(-50%));
    }
  }

.quick-list {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-right: 10px;
  .PIPL {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}

.top-bar__right {
    .quick-list-icon {
      width: 18px;
      height: 18px;
      vertical-align: middle;
    }
  }
</style>
