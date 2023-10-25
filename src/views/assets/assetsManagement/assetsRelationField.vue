<template>
    <el-drawer v-loading.fullscreen.lock="fullscreenLoading" :size="relationDialogSize" v-if="relationDialog" append-to-body :visible.sync="relationDialog">
        <div class="drawer-header" slot="title">
            <span class="drawer-header-title" v-html="relationTitle"></span>
            <div class="drawer-header-screen" @click="() => isFullscreen = !isFullscreen">
            <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
            </div>
        </div>
        <el-steps style="width: 60%;margin: 0 auto;" simple  :active="active" finish-status="success">
            <el-step :title="$t('assetsManagement.选择数据主体')"></el-step>
            <el-step :title="$t('assetsManagement.选择字段')"></el-step>
            <el-step v-if="isAssets" :title="$t('assetsManagement.字段配置')"></el-step>
        </el-steps>
        <DataSubject
            v-show="active === 0"
            ref="dataSubject"
            :disabledKeys="disabledKeys"
            :echoCheckedDataSubjectList="echoCheckedDataSubjectList"
            @getCheckedDataSubject="getCheckedDataSubject"
        />
        <SelectField
            v-show="active === 1"
            ref="selectField" 
            :defaultActive="defaultActive"
            :projectId="projectId"
            :checkedDataSubjectObjList="checkedDataSubjectObjList"
            :disabledKeys="disabledKeys"
            :isView="false"
            />

        <FieldRelation
            v-if="isAssets"
            v-show="active === 2"
            ref="fieldRelation" 
            :projectId="projectId"
            :isView="false"
            :fieldList="fieldList"
            :saveBtnText="saveBtnText"
            @saveSuccess="saveSuccess"
            />
        <div class="demo-drawer__footer">
            <el-button 
                type="primary" 
                v-if="active !== 0" 
                icon="el-icon-top"
                @click="previousStep">{{$t('assetsManagement.上一步')}}</el-button>
            <el-button 
                type="primary" 
                v-if="active === 0 || active !== 2 && isAssets" 
                icon="el-icon-bottom"
                @click="nextStep">{{$t('assetsManagement.下一步')}}</el-button>
            <el-button 
                type="primary" 
                v-if="active === 1 && !isAssets" 
                icon="el-icon-check"
                @click="saveField">{{$t('assetsManagement.保存')}}</el-button>
            <el-button 
                type="primary"
                v-if="active === 2"
                :icon="saveBtnText ===$t('assetsManagement.保存')?'el-icon-circle-plus-outline':'el-icon-circle-check'"
                @click="relationFormSubmit">{{saveBtnText}}</el-button>
            <el-button 
                icon="el-icon-circle-close"
                @click="relationDialog = false">{{$t('assetsManagement.取消')}}</el-button>
        </div>
    </el-drawer>
  </template>
  
  <script>
  import {
    getAssetsProjectAttributesListByProjectId,
    assetsAddAttributes,
    getProjectAttributesListByProjectId
  } from "@/api/assets/assetsManagement";
  import  DataSubject from "@/views/assets/assetsManagement/dataSubject";
  import  SelectField from "@/views/assets/assetsManagement/selectField";
  import  FieldRelation from "@/views/assets/assetsManagement/fieldRelation";
  import { mapGetters } from "vuex";
  
  export default {
    name: "assetsRelationField",
    components: {DataSubject, SelectField, FieldRelation},
    props: {
        isAssets: {
            type: Boolean,
            default: false
        }
    },
    data() {
      return {
        active: 0,
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
      // 下一步
      nextStep() {
        if(this.active === 0) {
          if(this.checkedDataSubjectObjList.length === 0) {
            this.$message.error(this.$t('assetsManagement.请至少选择一个主体类型'))
          } else {
            this.defaultActive = this.checkedDataSubjectObjList[0].mainBodyId + ''
  
            this.$refs.selectField.handleChecked(this.defaultActive)
            console.log(this.defaultActive, 'mmmm');
            this.active++
          }
        }else if(this.active === 1) {
          const dataList = this.$refs.selectField.getCheckedDataSubjectObjList()
          const isCheckField = dataList.every(item => {
            return 'checkedFieldListAll' in item && item.checkedFieldListAll.length !== 0
            })
          if(isCheckField) {
            this.fieldList = this.handleFieldList(dataList)
              if(this.fieldList.length === 0) {
                this.$message.error(this.$t('assetsManagement.请选择主体类型下面的字段'))
              } else {
                this.active++
              }
          } else {
            this.$message.error(this.$t('assetsManagement.请选择主体类型下面的字段'))
          }
        } 
        // else {
        // this.active++
  
        // }
        // this.active++
      },
      // 上一步
      previousStep() {
        this.active--
      },
      saveField() {
        this.fullscreenLoading = true
        const dataList = this.$refs.selectField.getCheckedDataSubjectObjList()
        this.fieldList = this.handleFieldList(dataList)
        this.fieldList.forEach((item, index) => {
          if(!('status' in item)){
            this.fieldList[index].status = 1
            this.fieldList[index].projectId = this.projectId
          }
        })
        console.log(this.checkedDataSubjectObjList, 'checkedDataSubjectObjListcheckedDataSubjectObjList')
        this.relationDialog = false

        assetsAddAttributes(this.fieldList).then(res => {
            if(res.data.status === 200) {
              this.relationDialog = false
              this.fullscreenLoading = false
              this.$emit('saveSuccess', this.fieldList, this.checkedDataSubjectObjList)
              this.$message.success(res.data.message)
            }
          })
      },
      // 根据资产id查询关联字段信息
      getAssetsProjectAttributesListByProjectId(id) {
          return getAssetsProjectAttributesListByProjectId(id).then(res => {
              this.echoCheckedDataSubjectList = this.handleEchoData(res.data.data)
              this.fieldList = this.handleFieldList(this.echoCheckedDataSubjectList)
          })
      },
      // 根据资产id查询字段(业务场景用)
      getProjectAttributesListByProjectId(id) {
        return getProjectAttributesListByProjectId(id).then(res => {
              this.echoCheckedDataSubjectList = this.handleEchoData(res.data.data)
              this.disabledKeys = this.echoCheckedDataSubjectList.map(item => item.mainBodyId)
              this.fieldList = this.handleFieldList(this.echoCheckedDataSubjectList)
          })
      },
      // 获取勾选的数据主体类型
      getCheckedDataSubject(checkedDataSubjectList, checkedDataSubjectObjList) {
        this.checkedDataSubjectObjList = checkedDataSubjectObjList
      },
      // 处理字段数据，用于回显字段列表
      handleFieldList(data) {
        return data.reduce((pre, cur, curIndex, arr) => {
            const Arr = Object.values(cur.checkedFieldListAll).flat()
            Arr.forEach((f,i)=> {
                f.dataSubjectsVolume = f.dataSubjectsVolume || 0
                f.identification = `${f.mainBodyId}+${f.attributesId}`
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
            item.checkedCategoryList.forEach((x, j) => {
              item.checkedFieldListAll[x] = item.attributes.filter(a => x === a.categoryId)
              item.checkedFieldList[x] = item.checkedFieldListAll[x].map(a => a.attributesId)
            })
          })
          return data
      },
    
      // 打开关联字段弹窗
      relationBtn(row, relationDialogSize) {
        this.relationDialogSize = relationDialogSize
        this.fullscreenLoading = true
        this.active = 0
        this.projectId = row.projectId
        this.relationTitle = `<i class="${row.projectIcon}"></i> <span style="font-weight: 700;">${row.projectName}</span> ${this.$t('assetsManagement.关联字段')}`
        this.relationDialog = true
        const Api = relationDialogSize === '100%' ? this.getAssetsProjectAttributesListByProjectId(this.projectId) : this.getProjectAttributesListByProjectId(this.projectId)
        Api.then(()  => {
          this.saveBtnText = this.echoCheckedDataSubjectList.length ? this.$t('assetsManagement.修改') : this.$t('assetsManagement.保存')
          this.$refs.dataSubject.echoChecked()
          this.fullscreenLoading = false
        })
      },
  
      // 提交关联字段
      relationFormSubmit() {
        this.fullscreenLoading = true
        this.$refs.fieldRelation.saveCurd()
      },
      // 子组件数据保存成功
      saveSuccess(isUpdate) {
        this.$emit('saveSuccess', isUpdate)
        // if(isUpdate === true) {
          // this.reassess(this.projectId)
        // }
        this.relationDialog = false
        this.fullscreenLoading = false
        // this.getList(this.page)
      },
     
    },
  };
  </script>

  <style lang="scss" scoped>
  ::v-deep  .avue-icon i { 
    font-size: 16px !important;
  }
  </style>