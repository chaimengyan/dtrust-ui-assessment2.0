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
      <template v-if="!fullscreenLoading">
        <DataSubject
          v-show="active === 0"
          ref="dataSubject"
          @change="onDataSubject"
        />
        <SelectField
            v-show="active === 1"
            ref="selectField"
            :projectId="projectId"
        />
        <FieldRelation
            v-show="active === 2"
            ref="fieldRelation"
            :projectId="projectId"
            :isView="false"
            :saveBtnText="saveBtnText"
            @saveSuccess="saveSuccess"
            />
      </template>



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
} from "@/api/assets/assetsManagement";
import  DataSubject from "@/views/assets/assetsManagement/dataSubject";
import  SelectField from "@/views/assets/assetsManagement/selectField";
import  FieldRelation from "@/views/assets/assetsManagement/fieldRelation";
import { mapGetters } from "vuex";

export default {
  name: "assetsRelationField",
  components: {DataSubject, SelectField, FieldRelation},
    provide() {
      return {
          echoCheckedDataSubjectList: () => this.echoCheckedDataSubjectList,
          checkedMainBody: () => this.checkedMainBody,
      }
    },
  props: {
      isAssets: {
          type: Boolean,
          default: false
      }
  },
  data() {
    return {
        // 回显所用数据
        echoCheckedDataSubjectList: [],
        // 选中的主体信息
        checkedMainBody: [],

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

      // 完整勾选数据主体类型
      checkedDataSubjectObjList: [],
      // 完整勾选字段
      fieldList: [],
      isFullscreen: false,
      disabledKeys: null,
      relationDialogSize: '100%'
    };
  },
  methods: {
    // 下一步
    nextStep() {
        this.active++
        if (this.active === 1) {
            this.$refs.selectField.mounted()
            this.$refs.selectField.setValue()
        }
        if (this.active === 2) {
            const attrs = this.$refs.selectField.getAttrs()
            this.$refs.fieldRelation.init(attrs)
        }
    },
    // 上一步
    previousStep() {
      this.active--
    },
      // 选中主体保存option到父组件
      onDataSubject(checkedDataSubjectOptions) {
        this.checkedMainBody = [...checkedDataSubjectOptions]
      },

    // 根据资产id查询关联字段信息
    getAssetsProjectAttributesListByProjectId(id) {
        return getAssetsProjectAttributesListByProjectId(id).then(res => {
          this.echoCheckedDataSubjectList = res.data.data
        })
    },

    // 打开关联字段弹窗
    relationBtn(row) {
      this.fullscreenLoading = true
      this.active = 0
      this.projectId = row.projectId
      this.relationTitle = `<i class="${row.projectIcon}"></i> <span style="font-weight: 700;">${row.projectName}</span> ${this.$t('assetsManagement.关联字段')}`
      this.relationDialog = true
      const Api = this.getAssetsProjectAttributesListByProjectId(this.projectId)
      Api.then(()  => {
        this.saveBtnText = this.echoCheckedDataSubjectList.length ? this.$t('assetsManagement.修改') : this.$t('assetsManagement.保存')
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
