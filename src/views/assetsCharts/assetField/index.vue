<template>
  <div class="container">
    <div class="topBox">
      <!-- 过滤字段 -->
      <FilterFields
        @filterFields="filterFields"
        @svgAutoAdjustment="svgAutoAdjustment"
      />
      <!-- 字段方块 -->
      <div class="icon-container">
        <template v-for="item in fieldsList">
          <el-tooltip :content="item.attributesName" placement="bottom" effect="light" :key="item.attributesId">
            <div 
              :style="{'background-color': attributesId === item.attributesId ? item.attributesColor: 'white',
                       'color': attributesId === item.attributesId ? 'white' : item.attributesColor}"
              class="attributes-block icon-block"
              @click="handleClick($event, item)"
            >
              <!-- <i style="pointer-events: none;font-size: 18px;" :class="item.attributesIcon"></i> -->
              <div style="font-size:12px;">{{item.attributesName.substring(0, 2)}}</div>
            </div>
          </el-tooltip>
        </template>
      </div>
    </div>
    <!-- 连线 -->
    <!-- <div v-for="(item, i) in iconData" :key="i">
        <div v-for="(_item, _i) in item" :key="_i">
          <SvgBlock
            v-if="item[_i + 1]"
            v-bind="_item"
            :dur="_i"
            :nextIconProps="item[_i + 1]"
          />
        </div>
    </div> -->

    <!-- 资产 -->
    <div v-for="(asset, i) in assetsList" :key="i" class="assetsList">
      <span class="projectName">
        <el-tooltip :content="asset.assetsProject.projectName" placement="bottom" effect="light">
          <div 
            :style="{'background-color': asset.assetsProject.projectColor}"
            class="project-block icon-block"
          >
            <i style="pointer-events: none;font-size: 18px;" :class="asset.assetsProject.projectIcon"></i>
          </div>
        </el-tooltip>
      </span>
      <!-- 资产里的字段 -->
        <template v-for="field in asset.assetsAttributes">
          <el-tooltip placement="bottom" effect="light" :key="field.attributesId">
            <!-- 资产字段提示内容 -->
            <div slot="content">
              {{$t('assetField.字段数量') +field.attributesName + ' ' + field.fieldNum}}<br/>
              {{$t('assetField.主体数量')+filterMainBodyName(field.assetsProjectAttributes) }}
            </div>
            <div 
              :data-id="field.attributesId" 
              class="assetsList-item"
              :style="{'background-color': field.attributesColor,
                        'opacity': attributesId === field.attributesId ? 1 : 0.1,
                        width: `${field.width}%`}"
              @click="clickAsset(field)">
            </div>
          </el-tooltip>
        </template>

      

    </div>

    
      
    
  </div>
</template>

<script>
import {
  getAllAttributesByIds
} from "@/api/fieldManagement/fieldMasterData";
import {
  getAssetsByAttributesId
} from "@/api/assetsCharts/assetField";
import FilterFields from '@/views/assetsCharts/assetField/filterFields'
import SvgBlock from '@/views/assetsCharts/assetField/SvgBlock'
import { getStore, removeStore } from '@/util/store'
import { mapGetters } from 'vuex'
import { Loading } from 'element-ui';

export default {
  name: 'index',
  components: { FilterFields, SvgBlock },
  data() {
    return {
      assetsList: [],
      fieldsList: [],
      iconData: {},

      mainBodyList: [],
      categoryList: [],
      typeList: [],

      maxLength: 0,

      attributesId: null,
      isShow: false,
    }
  },
  computed: {
    ...mapGetters(["keyCollapse"]),
    filterMainBodyName() {
      return val => {
        return val.map(x => {
          const mainBodyName =  this.mainBodyList.find(m => m.mainBodyId === x.mainBodyId).mainBodyName
          return `${mainBodyName} ${x.dataSubjectsVolume}`
          }).join()
      }
    }
  },
    watch: {
      "keyCollapse": {
          handler(n, o) {
             this.svgAutoAdjustment()
          }
      }
    },
  created() {
    this.getAllAttributesByIds([],[],[],'')
    window.addEventListener('resize', this.svgAutoAdjustment)
  },
  mounted() {
    this.categoryList = getStore({ name: "categoryList" })
    this.typeList = getStore({ name: "typeList" })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.svgAutoAdjustment)
  },
  methods: {
    // 过滤字段
    filterFields(filterForm) {
      const { attributesName, mainBodyIds, categoryIds, typeIds } = filterForm
      this.getAllAttributesByIds( categoryIds, typeIds, mainBodyIds, attributesName)
    },
    
    // 点击资产上的字段
    clickAsset(field) {
      console.log(field, 'field')
      
    }, 

    // 获取字段
    getAllAttributesByIds(categoryIds, typeIds, mainBodyIds, attributesName) {
      getAllAttributesByIds(categoryIds, typeIds, mainBodyIds, attributesName).then(res => {
        this.fieldsList = res.data.data
      })
    },

    // 根据字段获取资产
    getAssetsByAttributesId(attributesId) {
      return getAssetsByAttributesId(attributesId).then(res => {
        this.assetsList = res.data.data
        if (!this.assetsList.length) return;
        this.maxLength = this.assetsList.map(item => {
          return item.assetsProjectAttributes.reduce((pre, cur) => {
              return cur.dataSubjectsVolume + pre
            }, 0)
        }).sort(function (a, b) {
          return b-a;
        })[0]
        
        this.assetsList.forEach((asset, i, arr) => {
          asset.assetsAttributes.forEach((att) => {
            att.assetsProjectAttributes = asset.assetsProjectAttributes.filter(item => item.attributesId === att.attributesId)
            att.fieldNum = att.assetsProjectAttributes.reduce((pre, cur) => {
              return cur.dataSubjectsVolume + pre
            }, 0)
            att.width = att.fieldNum / this.maxLength * 100 
          })

        })

      })
      .catch(() => {
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loading.close();
        });
      })
    },

    // 生成选中方块以及需要关联的字段结构
    buildBlockParams(el, data) {
      const result = {
        el,
        calBlock() {
          this.left = this.el.offsetLeft
          this.top = this.el.offsetTop
          this.width = this.el.offsetWidth
          this.height = this.el.offsetHeight
        },
        background: this.fieldsList.find(x => x.attributesId === data.attributesId).attributesColor
      }
      result.calBlock()
      return result
    },

    // 点击字段方块
    handleClick(e, item) {
      console.log(e, item, '????????');
      const loading = Loading.service();
      
      this.isShow = !this.isShow
      this.iconData ={}
      this.assetsList = []
      if (this.attributesId === item.attributesId && !this.isShow) return loading.close();
      this.attributesId = item.attributesId
      this.mainBodyList = getStore({ name: "mainBodyList" })
      this.getAssetsByAttributesId(item.attributesId).then(() => {
        // 获取真实dom求出坐标
        const doms = [e.target, ...document.querySelectorAll(`.assetsList div[data-id='${item.attributesId}']`)]
        // 根据坐标信息渲染icon连线
        const values = doms.map(el => this.buildBlockParams(el, item))

        if (this.iconData[item.attributesId]) {
          delete this.iconData[item.attributesId]
        } else {
          this.iconData[item.attributesId] = values
        }
        this.iconData = {...this.iconData}
        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          loading.close();
        });
      })
      
    },

    // 连线响应式
    svgAutoAdjustment() {
      const iconData = Object.values(this.iconData)
      if (iconData.length) {
          setTimeout(() => {
            iconData.flat().forEach(item => item.calBlock())
          }, 400)
      }
    }
  }
}
</script>

<style scoped>
.container {
  padding: 2px 20px;
  height: 100%;
  background-color: #ffffff;
}
.topBox {
  background-color: #f8f8f8;
  border-radius: 5px;
  margin-top: 10px;
  padding-top: 10px;

}
  .assetsList {
    margin-bottom: 10px;
    display: flex;
    height: 50px;
    border-radius: 15px;
    background-color: #f8f8f8;

  }
  
  .assetsList > div {
    height: 30%;
    margin-top: 18px;
    border-radius: 20px;

  }
  .projectName {
    margin-left: 10px;
    font-size: inherit;
    color: white;
    font-family: fangsong;
    /* font-weight: 600; */
    margin-top: 5px;

  }
  .project-block {
    margin-right: 10px;

  }

  .icon-container {
    margin-bottom: 20px;
    /* padding-top: 20px; */
    display: flex;
    flex-wrap: wrap;
  }
  .icon-block {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-left: 15px;
    display: flex;
    justify-content: space-around;
    align-items: center;

  }
  .icon-container .attributes-block {
    margin-bottom: 10px;
  }
  .fields {
    display: flex;
  }
  .attributesName {
    font-size: 12px;
  }
  .fieldPage {
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
