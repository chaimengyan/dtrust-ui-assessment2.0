<template>
    <basic-container>
      <div class="relation-container">
          <avue-crud
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
              <el-button  icon="el-icon-notebook-2" circle :size="size" @click="changeArray"></el-button>
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
                >{{$t('assetsManagement.配置')}}</el-button
              >
            </template>
          </avue-crud>
        </div>
      
        
        <el-dialog 
          :title="sourceTitle" 
          v-if="sourceDialog" 
          :visible.sync="sourceDialog" 
          append-to-body
          :close-on-click-modal="false" 
          :fullscreen="isFullscreen">
          <div class="dialog-header" slot="title">
            <span class="dialog-header-title">{{sourceTitle}}</span>
            <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
              <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
            </div>
          </div>
          <el-form ref="sourceForm" :model="sourceForm" label-width="100px" style="width:50%">
            <el-form-item :label="$t('assetsManagement.字段来源')">
              <el-select v-model="sourceForm.sourceName" filterable>
                <el-option
                  v-for="item in sourceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('assetsManagement.字段数量')">
              <el-input-number v-model="sourceForm.dataSubjectsVolume" :min="0" />
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
  getAssetsProjectAttributesByAttributeId,
  assetsAddAttributes,
  getAssetsProjectAttributes
} from "@/api/assets/assetsManagement";
import {deepClone} from '@/util/util'
import {fieldRelationOption} from "@/const/crud/assets/assetsManagement"
export default {
    name: "FieldRelation",
    props: {
      fieldList: {
          type: Array,
          default: () => []
      },
      projectId: {
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
         page: {
          pageSize: 10,
          total: 0, // 总页数
          currentPage: 1, // 当前页数
        },
        pageList: [],
        temporaryFieldList: [],
        sourceDialog: false,
        rowIndex: '',
        sourceForm: {},
        sourceOptions: [{
          label: '直接来自个人',
          value: '0'
        }, {
          label: '内部系统',
          value: '1'
        }, {
          label: '第三方系统',
          value: '2'
        }, {
          label: '离线导入',
          value: '3'
        }, ],
        identificationList: [],
        rowList: [],
        // 是否是批量关联
        isBatch: false,
        searchParam: [],
        sourceTitle: this.$t('assetsManagement.配置'),
        isFullscreen: false,
        isOverHidden: true,
      };
    },
    watch: {
      fieldList: {
        handler(newVal, oldVal) {
          if(JSON.stringify(this.searchParam) !== '{}') {
            this.handleFilter(this.searchParam)
          } else {
            this.pageList = deepClone(this.fieldList)
            this.onLoad(this.page, this.fieldList)
          }
            
        }
        
      },
    },
    computed: {
      option() {
        return fieldRelationOption(this, this.isView, this.isOverHidden)
      },
    },
    created() {
    },
    methods: {
      changeArray() {
        this.isOverHidden = !this.isOverHidden
        fieldRelationOption(this, this.isView, this.isOverHidden)
      },
      onLoad(page, pageList) {
        this.page.total = pageList.length
        this.temporaryFieldList = deepClone(pageList)
        .splice((this.page.currentPage - 1)*page.pageSize, this.page.pageSize)
      },

      // 初始化sourceForm
      initSourceForm() {
        this.sourceForm = {
          sourceName: '',
          dataSubjectsVolume: 0,
        }
        // this.sourceOptions = []
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
        if ('keyword' in param) {
          this.pageList = this.pageList.filter(x => {
            return x.mainBodyName.indexOf(param.keyword) !== -1 || x.attributesName.indexOf(param.keyword) !== -1 || (x.parentProjectAttributesNames && x.parentProjectAttributesNames.indexOf(param.keyword) !== -1)
          })
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
      selectionChange(list){
        this.identificationList = list.map(item => (item.identification))
        this.rowList = list
      },

      // 批量关联弹窗
      batchCheckSource() {
        console.log(this.rowList, 'rowListrowList');
        if(this.identificationList.length === 0) return this.$message.error(this.$t('assetsManagement.请至少选择一个字段'))
        const obj = this.rowList.map(r => {
          return {attributesId: r.attributesId, projectId: this.projectId, mainBodyId: r.mainBodyId}
        })
        // this.getAssetsProjectAttributes(obj)
        this.isBatch = true
        this.sourceTitle = this.$t('assetsManagement.批量配置')
        this.initSourceForm()
        this.sourceDialog = true

      },

      // 保存表格数据
      saveCurd() {
        this.fieldList.forEach((item, index) => {
          this.fieldList[index].projectId = this.projectId
        })
        if(!this.fieldList[0]) {
          this.$message.error(this.$t('assetsManagement.请选择需要关联的字段'))
        } else {
          assetsAddAttributes(this.fieldList).then(res => {
            if(res.data.status === 200) {
              this.$emit('saveSuccess', res.data.data)
              this.$message.success(res.data.message)
            }
          })
        }
        
      },
      // 添加关联
      checkSource(row, index) {
        console.log(row, 'rowwwww');
        this.isBatch = false
        this.initSourceForm()
        this.sourceTitle = this.$t('assetsManagement.配置')
        this.rowIndex = row.identification
        this.sourceForm.sourceName = row.sourceName
        this.sourceForm.dataSubjectsVolume = row.dataSubjectsVolume
        this.sourceDialog = true
        // this.getAssetsProjectAttributesByAttributeId(row.attributesId, row.mainBodyId, this.projectId)
      },
      
      // 获取字段来源
      getAssetsProjectAttributesByAttributeId(fieldId, mainBodyId, assetsId) {
        getAssetsProjectAttributesByAttributeId(fieldId, mainBodyId, assetsId).then(res => {
          this.sourceOptions = res.data.data
        })
      },

      // 批量关联时获取字段来源交集
      getAssetsProjectAttributes(obj) {
        getAssetsProjectAttributes(obj).then(res => {
          this.sourceOptions = res.data.data
        })
      },
      // 保存字段来源
      saveSource() {
        if(this.isBatch) {
          this.fieldList.forEach((item,index) => {
            if(this.identificationList.includes(item.identification)) {
              this.$set(this.fieldList, index, {...item, ...this.sourceForm})
            }
          })
        } else {
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