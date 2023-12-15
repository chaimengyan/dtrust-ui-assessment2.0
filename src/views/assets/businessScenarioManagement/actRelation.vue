<template>
  <basic-container>
    <div class="relation-container">
        <!-- <avue-crud
          ref="crud"
          :page.sync="page"
          :data="temporaryFieldList"
          :option="option"
          @search-change="searchChange"
          @search-reset="searchReset"
          @size-change="sizeChange"
          @current-change="currentChange"
          @selection-change="selectionChange"
          >
          <template slot="menuRight" slot-scope="{size}">
            <el-button icon="el-icon-notebook-2" circle :size="size" @click="changeArray"></el-button>
          </template>
          <template v-if="!isView" slot-scope="{row,index}" slot="menuLeft">
            <el-button
              size="small"
              icon="el-icon-setting"
              @click="batchCheckSource(row,index)"
              >{{$t('assetsManagement.批量配置')}}</el-button
            >
          </template>
          <template slot-scope="{row,index}" slot="menu">
            <el-button
              type="text"
              size="small"
              icon="el-icon-setting"
              @click="checkSource(row,index)"
              >{{$t('assetsManagement.配置')}}</el-button>
          </template>
        </avue-crud> -->
        <avue-crud 
           v-model="treeForm"
           :option="option"
           :data="temporaryTreeFieldList"
           ref="treeCrud"
           >
           <template slot="menuRight" slot-scope="{size}">
            <el-button icon="el-icon-notebook-2" circle :size="size" @click="changeArray"></el-button>
          </template>
          <template v-if="!isView" slot-scope="{row,index}" slot="menuLeft">
            <el-button
              size="small"
              icon="el-icon-setting"
              @click="batchCheckSource(row,index)"
              >{{$t('assetsManagement.批量配置')}}</el-button
            >
          </template>
          <template slot-scope="{row,index}" slot="menu">
            <el-button
              v-if="!('children' in row)"
              type="text"
              size="small"
              icon="el-icon-setting"
              @click="checkSource(row,index)"
              >{{$t('assetsManagement.配置')}}</el-button>
          </template>
        </avue-crud>
      </div>
    
      <el-dialog 
        :title="$t('assetsManagement.配置')" 
        v-if="sourceDialog" 
        :visible.sync="sourceDialog"  
        append-to-body
        :close-on-click-modal="false" 
        :fullscreen="isFullscreen">
        <div class="dialog-header" slot="title">
          <span class="dialog-header-title">{{$t('assetsManagement.配置')}}</span>
          <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
            <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
          </div>
        </div>
        <el-form ref="sourceForm" :model="sourceForm" label-width="140px" style="width:80%">
          <el-form-item :label="$t('assetsManagement.数据主体数量')" >
            <el-input-number v-model="sourceForm.volumeOfDataSubjects" :min="0" />
          </el-form-item>
          
          <el-form-item :label="$t('businessScenarioManagement.数据处理活动')" >
            <el-cascader
              v-model="sourceForm.activitiesIdList"
              :placeholder="`${$t('crudCommon.请选择')}${$t('businessScenarioManagement.数据处理活动')}`"
              :options="activitiesOptions"
              :props="{ multiple: true, emitPath: false}"
              :show-all-levels="false"
              @change="changeEvent"
              filterable></el-cascader>
          </el-form-item>
          <el-form-item label="">
            <el-divider></el-divider>
            <ActAnswers
              ref="actAnswers"
              :activitiesList="sourceForm.assetsSceneProjectAttributesActivitiesList"
            />
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button 
              type="primary" 
              :icon="saveBtnText ===$t('assetsManagement.保存')?'el-icon-circle-plus-outline':'el-icon-circle-check'"
              @click="saveSource">{{saveBtnText}}</el-button>
            <el-button 
              icon="el-icon-circle-close"
              @click="sourceDialog = false">{{$t('assetsManagement.取消')}}</el-button>
        </div>
      </el-dialog>
      
  </basic-container>
</template>
<script>
import {
addOrUpdateRelatedAssets
} from "@/api/assets/businessScenarioManagement";

import {
getAllAssetsActivities
} from "@/api/assets/dataProcessingActivities";
import { activitiesCategoryOptions } from "@/util/enum"
import ActAnswers from "@/views/assets/businessScenarioManagement/actAnswers";
import {deepClone} from '@/util/util'
import {actRelationOption} from "@/const/crud/assets/businessScenarioManagement"
import { isArray } from 'lodash'

export default {
  name: "actRelation",
  components: {
    ActAnswers,
  },
  props: {
    fieldList: {
      type: Array,
      default: () => []
    },
    sceneId: {
      type: Number,
      default: 0
    },
    isView: {
      type: Boolean,
      default: false
    },
    saveBtnText: {
      type: String,
      default: '保 存'
    }
  },
  data() {
    return {
      treeForm: {},
      page: {
        pageSize: 10,
        total: 0, // 总页数
        currentPage: 1, // 当前页数
      },
      pageList: [],
      temporaryFieldList: [],
      temporaryTreeFieldList: [],
      sourceDialog: false,
      rowIndex: '',
      sourceForm: {},
      activitiesCategoryOptions,
      activitiesOptions: [],
      // 数据处理活动列表
      actList: [],
      identificationList: [],
      searchParam: {},
      // 是否是批量关联
      isBatch: false,
      isFullscreen: false,
      isOverHidden: true,
      treeOption: [],
      currentRow: null,
      keys: ['gatherActivitiesList', 'storageActivitiesList', 'useActivitiesList', 'transmitActivitiesList', 'delActivitiesList']
    };
  },
  watch: {
    fieldList: {
      handler(newVal, oldVal) {
        if(JSON.stringify(this.searchParam) !== '{}') {
          this.handleFilter(this.searchParam)
        } else {
          console.log(this.fieldList, 'this.fieldList///');
          this.pageList = deepClone(this.fieldList)
          this.onLoad(this.page, this.fieldList)
        }
          
      }
      
    },
  },
  computed: {
    option() {
      return actRelationOption(this, this.isView, this.isOverHidden)
    },
  },
  created() {
    this.getAllAssetsActivities()
  },
  methods: {
    changeArray() {
      this.isOverHidden = !this.isOverHidden
      actRelationOption(this, this.isView, this.isOverHidden)
    },
    onLoad(page, pageList) {
      this.page.total = pageList.length
      this.temporaryTreeFieldList = this.tranListToTreeData(deepClone(pageList), '')
      this.temporaryFieldList = deepClone(pageList).splice((this.page.currentPage - 1)*page.pageSize, this.page.pageSize)
    },
    tranListToTreeData(list) {
      console.log(list, 'list=======')
      const data = list.reduce((pre, cur) => {
        const len = list.filter(item => item.attributesId === cur.attributesId)
        
        // debugger
        // cur.id = cur.identification
        if (len.length === 1) {
          pre[cur.attributesId] = cur;
          return pre;
        }
        if (!pre[cur.attributesId]) {
          console.log(cur, 'cur');
          pre[cur.attributesId] = {
            id: cur.attributesId,
            attributesName: cur.attributesName,
            children: [cur],
          }
          Reflect.deleteProperty(cur, 'attributesName')
          return pre;
        }

        Reflect.deleteProperty(cur, 'attributesName')
        pre[cur.attributesId].children.push(cur)
        return pre;
      }, {})
      console.log(data, '????data');

      return Object.values(data);
    },
    // 初始化sourceForm
    initSourceForm() {
      this.sourceForm = {
        activitiesIdList: [],
        volumeOfDataSubjects: 0,
        activitiesCategoryIdList: [],
        assetsSceneProjectAttributesActivitiesList: [],
      }
    },

    // 搜索事件
    searchChange(param, done) {
      this.searchParam = param
      this.handleFilter(param)
      done()
    },

    // 搜索
    handleFilter(param) {
      this.page.currentPage = 1;
      this.pageList = deepClone(this.fieldList)
      for(let p in param) {
        if(p === 'keyword') {
          this.pageList = this.pageList.filter(x => {
            return x.attributesName.indexOf(param[p]) !== -1 || x.mainBodyName.indexOf(param[p]) !== -1 || x.projectName.indexOf(param[p]) !== -1 || (x.activitiesName && x.activitiesName.indexOf(param[p]) !== -1)
          })
        }else {
          this.pageList = this.pageList.filter(x => {
            return x[p].indexOf(param[p]) !== -1
          })
        }
      }
      this.onLoad(this.page, this.pageList)
    },

    // 清空搜索
    searchReset() {
      this.searchParam = {}
      this.pageList = deepClone(this.fieldList)
      this.onLoad(this.page, this.fieldList)
    },

    // 多选选中
    selectionChange(list) {
      this.identificationList = list.map(item => (item.identification))
    },

    // 批量关联弹窗
    batchCheckSource() {
      if(this.identificationList.length === 0) return this.$message.error(this.$t('assetsManagement.请至少选择一个字段'))
      this.isBatch = true
      this.initSourceForm()
      this.sourceDialog = true

    },

    findChildrenOptionByValue(value, options) {
      for (let index = 0; index < options.length; index++) {
        const item = options[index].children.find(item => item.value === value);
        if (item) {
          return item;
        }
      }
    },

    // 选择数据处理活动
    changeEvent(val) {
      this.keys.forEach(k => {
        this.$set(this.currentRow, k, undefined)
      })

      this.sourceForm.assetsSceneProjectAttributesActivitiesList = this.currentRow.assetsSceneProjectAttributesActivitiesList = this.actList.filter(a => {
        return this.sourceForm.activitiesIdList.includes(a.activitiesId)
      })
        this.sourceForm.assetsSceneProjectAttributesActivitiesList.forEach((item,index) => {
          if(!('echoActivitiesValue' in item)){
            if(item.activitiesType === 'radio') {
              this.$set(item, 'echoActivitiesValue', 0)
            } else if(item.activitiesType === 'checkbox') {
              this.$set(item, 'echoActivitiesValue', [])
            } else {
              this.$set(item, 'echoActivitiesValue', '')
            }
          }
          if(!('answers' in item)){
            item.answers = JSON.parse(item.activitiesJson).answers
          }
      })
    },

    transferData(data) {
      const result = [];

      data.forEach(item => {
        this.keys.forEach(key => {
          if (item[key]) {
            item[key] = {
              ...item[key],
              activitiesValue: item[key].value,
              activitiesLabel: item[key].label,
              "activitiesCategory": "0" 
            }
          }
        })
        if (item.children && item.children.length) {
          result.push(...this.transferData(item.children))
        } else {
          result.push(item)
        }
      })
console.log(result, 'result');
      return result
    },
      
    // 保存表格数据
    saveCurd() {
      // 树结构扁平化
      const data = this.transferData(this.temporaryTreeFieldList)
      console.log(data, 'data')
      this.fieldList.forEach((item, index) => {
        this.fieldList[index].projectAttributesId = item.id || item.projectAttributesId
        item.assetsSceneId = this.sceneId
        item.tenantId = undefined
      })
      if(!this.fieldList[0]) {
        this.$message.error(this.$t('assetsManagement.请选择需要关联的字段'))
      } else {
        addOrUpdateRelatedAssets(this.fieldList).then(res => {
          if(res.data.status === 200) {
            this.$emit('saveSuccess', res.data.data)
            this.$message.success(res.data.message)
          }
        })
      }
    },

    // 获取全部数据处理活动
    getAllAssetsActivities() {
      this.activitiesOptions = deepClone(this.activitiesCategoryOptions)
      getAllAssetsActivities().then(res => {
        this.actList = res.data.data
        this.actList.forEach((a, i) => {
          const activitiesItem = this.sourceForm.assetsSceneProjectAttributesActivitiesList.find(b => b.activitiesId === a.activitiesId)
          if(activitiesItem) {
            a.activitiesValue = activitiesItem.activitiesValue
            this.$set(a, 'echoActivitiesValue', activitiesItem.echoActivitiesValue)
          }
          for(let c of this.activitiesOptions) {
            if(a.activitiesCategory == c.value) {
              c.children.push({
                value: a.activitiesId, 
                activitiesAnswerLabel: this.getShowValue(activitiesItem), 
                activitiesAnswerValue: activitiesItem?.echoActivitiesValue, 
                activitiesQnLabel: a.activitiesName,
                label: a.activitiesName, 
                activitiesCategory: a.activitiesCategory,
                activitiesId: a.activitiesId, 
                parent: this.keys[c.value]})
              break
            }
          }
        })
        // this.changeEvent()
      })
    },

    getShowValue(activitiesItem) {
      const { echoActivitiesValue } = activitiesItem || {}
      if (!echoActivitiesValue) {
        return echoActivitiesValue;
      }
      console.log(echoActivitiesValue, 'echoActivitiesValue')
      const value = isArray(echoActivitiesValue) ? echoActivitiesValue : [echoActivitiesValue]
      
      const showValues = value.map(pValue => {
        const item = activitiesItem.answers?.find(item => item.value === pValue)
        if (item) {
          return item.label;
        }
        return pValue;
      }).filter(v => v)

      return showValues.join(', ')
    },

    // 添加单个关联弹窗
    checkSource(row, index) {
      this.isBatch = false
      this.initSourceForm()
      this.sourceForm.volumeOfDataSubjects = row.volumeOfDataSubjects

      const maps = this.keys.map(key => {
        const item = row[key] || [];
        return item.map(item => {
        const filterOption = this.actList.find(ac => ac.activitiesId === item.activitiesId);
          return { ...filterOption, echoActivitiesValue: item.activitiesAnswerValue, answers: JSON.parse(filterOption.activitiesJson)?.answers }
        })
      })
      this.sourceForm.assetsSceneProjectAttributesActivitiesList = maps.flat() || []
      this.sourceForm.assetsSceneProjectAttributesActivitiesList.forEach((item, index) => {
        const isString =  typeof item.echoActivitiesValue === "string";

        this.$set(item, 'echoActivitiesValue', isString ? JSON.parse(item.echoActivitiesValue) : item.echoActivitiesValue)
        this.sourceForm.activitiesIdList[index] = item.activitiesId
      })
      this.rowIndex = row.identification
      this.sourceDialog = true
      this.getAllAssetsActivities()
      this.currentRow = this.fieldList.find(item => item.identification === row.identification);
      console.log(this.currentRow,this.fieldList,row, 'currentRowcurrentRow');
    },
    
    // 保存关联信息
    saveSource() {
      const noAnswer = this.sourceForm.assetsSceneProjectAttributesActivitiesList
        .map(x => x.echoActivitiesValue)
        .filter(y => ['0', "''", '[]'].includes(JSON.stringify(y)))
      if(noAnswer.length) return this.$message.error(this.$t('businessScenarioManagement.还有问题没有回答'))

      this.keys.forEach(key => {
        this.$set(this.currentRow, key, [])
      })
console.log(this.currentRow, 'this.keys');
      this.sourceForm.assetsSceneProjectAttributesActivitiesList.forEach((item, index) => {
        const data = this.findChildrenOptionByValue(item.activitiesId, this.activitiesOptions)
        data.activitiesAnswerLabel = this.getShowValue(item);
        data.activitiesAnswerValue = JSON.stringify(item.echoActivitiesValue);
        data.activitiesType = item.activitiesType;

        this.$set(this.currentRow, data.parent, [...(this.currentRow[data.parent] || []), data])
      })
      // this.sourceForm.activitiesName = activitiesName.join('；')
      console.log(this.sourceForm.assetsSceneProjectAttributesActivitiesList, 'this.sourceForm.assetsSceneProjectAttributesActivitiesList');

      if(this.isBatch) {
        this.fieldList.forEach((item,index) => {
          if(this.identificationList.includes(item.identification)) {
            this.$set(this.fieldList, index, {...item, ...this.sourceForm})
          }
        })
      }else {
        this.fieldList.forEach((item,index) => {
          if(item.identification === this.rowIndex) {
            this.$set(this.fieldList, index, {...item, ...this.sourceForm})
          }
        })
      }
      this.sourceDialog = false
      this.$message.success(this.$t('assetsManagement.保存成功'))
    },


    sizeChange(size) {
      this.page.pageSize = size
      this.onLoad(this.page, this.pageList)
    },
    currentChange(current) {
      this.page.currentPage = current
      this.onLoad(this.page, this.pageList)
    },
  }
}
</script>
<style lang="scss" scoped>
.relation-container {
display: flex;
.container-left {
  flex-shrink: 0;
}
.container-right {
  margin-left: 20px;
  flex: 1;
}
}

// 计数器对齐
::v-deep .el-input-number {
display: contents;
}
</style>