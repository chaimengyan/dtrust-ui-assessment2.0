<template>
    <el-drawer v-loading.fullscreen.lock="fullscreenLoading" :size="relationDialogSize" v-if="relationDialog" append-to-body :visible.sync="relationDialog">
        <div class="drawer-header" slot="title">
            <span class="drawer-header-title" v-html="relationTitle"></span>
            <div class="drawer-header-screen" @click="() => isFullscreen = !isFullscreen">
            <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
            </div>
        </div>
      
     
        <SelectField
            ref="selectField" 
            :defaultActive="defaultActive"
            :checkedAssetObjList="checkedDataSubjectObjList"
            :isView="false"
            />
  
        <div class="demo-drawer__footer">
              <el-button 
                type="primary"
                :icon="saveBtnText ===$t('assetsManagement.保存')?'el-icon-circle-plus-outline':'el-icon-circle-check'"
                @click="relationFormSubmit(0)">{{'通过'}}</el-button>
              <el-button 
                type="danger"
                :icon="saveBtnText ===$t('assetsManagement.保存')?'el-icon-circle-plus-outline':'el-icon-circle-check'"
                @click="relationFormSubmit(2)">{{'拒绝'}}</el-button>
            <el-button 
                icon="el-icon-circle-close"
                @click="relationDialog = false">{{$t('assetsManagement.取消')}}</el-button>
        </div>
    </el-drawer>
  </template>
  
  <script>
  import {
    assetsAddAttributes,
    getAttributesListByProjectId,
    auditAssetsField
  } from "@/api/assets/assetsManagement";
  import  SelectField from "@/views/assets/reviewAssetFields/selectField";
  import { mapGetters } from "vuex";
  
  export default {
    name: "reviewDialog",
    components: { SelectField},
    props: {
        isAssets: {
            type: Boolean,
            default: false
        }
    },
    data() {
      return {
        // 关联字段弹窗
        relationDialog: false,
        // 关联弹窗title
        relationTitle: '',
        saveBtnText: this.$t('assetsManagement.保存'),
        // 资产id
        projectId: 0,
        fullscreenLoading: false,
        defaultActive: '',
        // 回显勾选的主体类型
        echoCheckedDataSubjectList: [],
        // 完整勾选数据主体类型
        checkedDataSubjectObjList: [],
        // 完整勾选字段
        fieldList: [],
        isFullscreen: false,
        disabledKeys: null,
        relationDialogSize: '100%'
      };
    },
    computed: {
    },
    created() {
     
    },
    methods: {
      
     
      // 根据资产id查询字段(业务场景用)
      getAttributesListByProjectId(query) {
        return getAttributesListByProjectId(query).then(res => {
              this.checkedDataSubjectObjList = this.handleEchoData(res.data.data)
              this.echoCheckedDataSubjectList = this.handleEchoData(res.data.data)
              this.disabledKeys = this.echoCheckedDataSubjectList.map(item => item.mainBodyId)
          })
      },
      // 获取勾选的数据主体类型
      getCheckedDataSubject(checkedDataSubjectList, checkedDataSubjectObjList) {
        this.checkedDataSubjectObjList = checkedDataSubjectObjList
      },
      // 处理字段数据，用于回显字段列表
      handleFieldList(data, status) {
        return data.reduce((pre, cur, curIndex, arr) => {
            const Arr = Object.values(cur.checkedFieldListAll).flat()
            Arr.forEach((f,i)=> {
              console.log(f, status, 'wwwwwww');
                f.status = status
            })
            return pre.concat(Arr)
        }, [])
      },
      // 处理关联字段接口返回数据，用于回显关联字段组件
      handleEchoData(data) {
         data.forEach((item,index) => {
            item.checkedCategoryList = item.categoryList.map(x => x.categoryId) || []
            item.checkedDataClass = item.typeList.map(x => x.typeId) || []
            if(!('checkedFieldList' in item)) {
                item.checkedFieldList = {}
            }
            if(!('checkedFieldListAll' in item)) {
                item.checkedFieldListAll = {}
            }
            if(!('fieldListAll' in item)) {
                item.fieldListAll = {}
            }
            item.checkedCategoryList.forEach((x, j) => {
              // item.checkedFieldListAll[x] = item.attributes.filter(a => x === a.categoryId)
              item.fieldListAll[x] = item.attributes.filter(a => x === a.categoryId)
              // item.checkedFieldList[x] = item.checkedFieldListAll[x].map(a => a.attributesId)
            })
          })
          return data
      },
    
      // 打开关联字段弹窗
      relationBtn(row, status, relationDialogSize) {
        this.relationDialogSize = relationDialogSize
        this.fullscreenLoading = true
        this.active = 0
        this.projectId = row.projectId
        this.relationTitle = `<i class="${row.projectIcon}"></i> <span style="font-weight: 700;">${row.projectName}</span> ${this.$t('assetsManagement.关联字段')}`
        this.relationDialog = true
        this.getAttributesListByProjectId({status, projectId: this.projectId}).then(()  => {
          this.saveBtnText = this.echoCheckedDataSubjectList.length ? this.$t('assetsManagement.修改') : this.$t('assetsManagement.保存')
          // this.$refs.dataSubject.echoChecked()
          this.fullscreenLoading = false
        })
      },
  
      // 提交关联字段
      relationFormSubmit(status) {
        const dataList = this.$refs.selectField.getCheckedAssetObjList()
        const isCheckField = dataList.every(item => {
          return 'checkedFieldListAll' in item && item.checkedFieldListAll.length !== 0
          })
        if(isCheckField) {
          this.fieldList = this.handleFieldList(dataList, status)
            if(this.fieldList.length === 0) {
              this.$message.error(this.$t('assetsManagement.请选择主体类型下面的字段'))
            } else {
        // this.fullscreenLoading = true
              auditAssetsField(this.fieldList).then(res => {

              })
              console.log(this.fieldList,status, 'this.fieldListthis.fieldList');
            }
        } else {
          this.$message.error(this.$t('assetsManagement.请选择主体类型下面的字段'))
        }
      },
      // 子组件数据保存成功
      saveSuccess(isUpdate) {
        this.$emit('saveSuccess', isUpdate)
        this.relationDialog = false
        this.fullscreenLoading = false
      },
     
    },
  };
  </script>
  
  <style lang="scss" scoped>
  ::v-deep  .avue-icon i { 
    font-size: 16px !important;
  }
  </style>