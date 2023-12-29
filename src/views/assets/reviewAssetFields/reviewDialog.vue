<template>
    <el-drawer v-loading.fullscreen.lock="fullscreenLoading" :size="relationDialogSize" v-if="relationDialog" append-to-body :visible.sync="relationDialog">
        <div class="drawer-header" slot="title">
            <span class="drawer-header-title" v-html="relationTitle"></span>
            <div class="drawer-header-screen" @click="() => isFullscreen = !isFullscreen">
            <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
            </div>
        </div>


        <SelectField
            v-if="fieldStatus === 1"
            ref="selectField"
            :checkedBody="checkedDataSubjectObjList"
            />
        <FieldRelation
          v-else
          ref="fieldRelation"
          :projectId="projectId"
          :isView="true"
          :fieldList="fieldList"
          />
        <div class="demo-drawer__footer" v-if="fieldStatus === 1">
              <el-button
                type="primary"
                icon="el-icon-circle-check"
                @click="relationFormSubmit(0)">{{$t('evaluationRecord.通过')}}</el-button>
              <el-button
                type="danger"
                icon="el-icon-circle-close"
                @click="relationFormSubmit(2)">{{$t('evaluationRecord.拒绝')}}</el-button>
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
  import  FieldRelation from "@/views/assets/assetsManagement/fieldRelation";
  import { mapGetters } from "vuex";

  export default {
    name: "reviewDialog",
    components: { FieldRelation,SelectField},
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
        relationDialogSize: '100%',
        fieldStatus: 0,
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
          res.data.data.forEach(item => {
            item.categoryList.forEach(cate => {
                cate._id = `${item.mainBodyId}.${cate.categoryId}`
            })
            item.attributes.forEach(attr => {
                attr._id = `${item.mainBodyId}.${attr.categoryId}.${attr.attributesId}`
            })
          })
          this.checkedDataSubjectObjList = res.data.data
          if([0,2].includes(this.fieldStatus)){
            this.fieldList = this.handleFieldList(res.data.data)
            this.$refs.fieldRelation.init(this.fieldList)
          }else {
            this.$refs.selectField.mounted()
          }
        })
      },
      // 获取勾选的数据主体类型
      getCheckedDataSubject(checkedDataSubjectList, checkedDataSubjectObjList) {
        this.checkedDataSubjectObjList = checkedDataSubjectObjList
      },
      // 处理字段数据，用于回显字段列表
      handleFieldList(data) {
        const attributes = data.map(d => d.attributes)
        return attributes.flat()
      },

      // 打开关联字段弹窗
      relationBtn(row, status, relationDialogSize) {
        this.fullscreenLoading = true
        this.relationDialog = true

        this.fieldStatus = status
        this.relationDialogSize = relationDialogSize
        this.active = 0
        this.projectId = row.projectId
        this.relationTitle = `<i class="${row.projectIcon}"></i> <span style="font-weight: 700;">${row.projectName}</span> ${this.$t('assetsManagement.关联字段')}`
        this.getAttributesListByProjectId({status, projectId: this.projectId}).then(()  => {
          if(this.checkedDataSubjectObjList.length === 0) {
            this.$message.error('暂无数据')
            this.relationDialog = false
            this.fullscreenLoading = false
            return
          }
          this.fullscreenLoading = false
        })
      },

      // 提交关联字段
      relationFormSubmit(status) {
        const dataList = this.$refs.selectField.getAttrs()
        if(dataList.length !== 0) {
          dataList.forEach((item,index) => {
            item.status = status
          })
          this.fullscreenLoading = true
          auditAssetsField(dataList).then(res => {
            this.$message.success(res.data.message)
            this.relationDialog = false
            this.fullscreenLoading = false
          })
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
