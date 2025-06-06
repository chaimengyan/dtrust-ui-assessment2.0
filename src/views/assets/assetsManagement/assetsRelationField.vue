<template>
  <el-drawer v-loading.fullscreen.lock="fullscreenLoading" :size="relationDialogSize" v-if="relationDialog" append-to-body :visible.sync="relationDialog">
      <div class="drawer-header" slot="title">
          <span class="drawer-header-title" v-html="relationTitle"></span>
          <div class="drawer-header-screen" @click="() => isFullscreen = !isFullscreen">
          <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
          </div>
      </div>
      <div class="header">
        <el-steps style="width: 60%;margin: 0 auto;" simple  :active="active" finish-status="success">
          <el-step :title="$t('assetsManagement.选择数据主体')"></el-step>
          <el-step :title="$t('assetsManagement.选择字段')"></el-step>
          <el-step v-if="isAssets" :title="$t('assetsManagement.字段配置')"></el-step>
        </el-steps>
        <div v-if="AILoading" class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div v-else class="AIBtn" style="margin-right: 30px;" @click="openAI">
            <img src="/img/MaxKB.gif" height="22px" width="22px">
                小信助手
        </div>
      </div>
           
    
      <template v-if="isShow">
        <DataSubject
          v-show="active === 0"
          ref="dataSubject"
          :projectId="projectId"
          :isAssets="isAssets"
          @change="onDataSubject"
        />
        <SelectField
            v-show="active === 1"
            ref="selectField"
            :projectId="projectId"
            :isAssets="isAssets"
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
              v-if="(active === 0 || active !== 2)"
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
  getProjectAttributesListByProjectId,
  adviceForAssetAttributes
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
          aiHighlightFields: () => this.aiHighlightFields,
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
        // ai建议高亮字段
        aiHighlightFields: [],
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
      isFullscreen: false,
      isShow: false,
      disabledKeys: null,
      relationDialogSize: '100%',
      AILoading: false,
    };
  },
  methods: {
    openAI() {
      this.AILoading = true
      const mainBodyIds = this.checkedMainBody.map(item => item.mainBodyIdReal)
      adviceForAssetAttributes(this.projectId, mainBodyIds).then(res => {
          // 这个就是chat组件实例，可以直接调用chat组件里的方法
          const chatRef = this.$store.state.common.chat
          console.log(chatRef,'chatRef');
          chatRef.start()
          chatRef.setAicontent(res.data.data, 'generateForAssetAttributes', this.projectId, mainBodyIds)
          chatRef.send('rightData')
          chatRef.setOnMessage((value) => {
            this.echoCheckedDataSubjectList = value.data.map(item => ({
              ...item,
              attributes: item.attributes.map(a => ({
                  ...a,
                  _id: `${this.projectId}.${item.mainBodyId}.${a.categoryId}.${a.attributesId}`
              })),
              mainBodyId: `${this.projectId}.${item.mainBodyId}`,
            }))
            console.log(this.echoCheckedDataSubjectList, 'this.echoCheckedDataSubjectList')
            this.$refs.dataSubject.setDefaultValue()
            this.$refs.selectField.mounted()
            this.$refs.selectField.setValue()
          })
      }).finally(() => {
        this.AILoading = false
      })
    },
    // 下一步
    nextStep() {
      if(this.active === 0 ) {
        if(this.checkedMainBody.length === 0) {
          return this.$message.error('请至少选择一个数据主体！')
        }
          this.active = 1
          this.$refs.selectField.mounted()
          this.$refs.selectField.setValue()
       }else if (this.active === 1) {
        console.log(this.$refs.selectField.getAttrs(), 'this.$refs.selectField.getAttrs()');
          const attrs = this.$refs.selectField.getAttrs()
          const mainBodyField = Array.from(new Set(attrs.map(a => a.mainBodyId)))
          let noFieldMainBodyName = []
          this.checkedMainBody.forEach((c,index) => {
            if(!mainBodyField.includes(c.mainBodyId)) {
              noFieldMainBodyName.push(c.mainBodyName)
            }
          })
          if(noFieldMainBodyName.length === 0) {
            this.$refs.fieldRelation.init(attrs)
            this.active = 2
          }else {
            this.$message.error(`以下主体还未选择字段：${noFieldMainBodyName.join('，')}`)
          }
        }
    },
    // 上一步
    previousStep() {
      this.active--
    },
    adviceForAssetAttributes(projectId, mainBodyIds) {
      adviceForAssetAttributes(projectId, mainBodyIds).then(res => {
        this.aiHighlightFields = res.data.data.map(item => ({
              ...item,
              attributes: item.attributes.map(item => ({
                  ...item,
                  _id: `${item.projectId}.${item.mainBodyId}.${item.categoryId}.${item.attributesId}`
              })),
              mainBodyId: `${this.projectId}.${item.mainBodyId}`
          }))
      })
    },
      // 选中主体保存option到父组件
      onDataSubject(checkedDataSubjectOptions) {
        this.checkedMainBody = [...checkedDataSubjectOptions]
        this.fullscreenLoading = false
      },

    // 根据资产id查询关联字段信息
    getAssetsProjectAttributesListByProjectId(id) {
        return getAssetsProjectAttributesListByProjectId(id).then(res => {
          this.echoCheckedDataSubjectList = res.data.data.map(item => ({
              ...item,
              attributes: item.attributes.map(item => ({
                  ...item,
                  _id: `${item.projectId}.${item.mainBodyId}.${item.categoryId}.${item.attributesId}`
              })),
              mainBodyId: `${this.projectId}.${item.mainBodyId}`
          }))
          if(this.echoCheckedDataSubjectList.length === 0) return this.fullscreenLoading = false
        })
    },

    // 根据资产id查询关联字段信息(通过业务场景打开资产关联弹窗时调用)
    getProjectAttributesListByProjectId(id) {
      return getProjectAttributesListByProjectId(id).then(res => {
          this.echoCheckedDataSubjectList = res.data.data.map(item => ({
              ...item,
              attributes: item.attributes.map(item => ({
                  ...item,
                  _id: `${item.projectId}.${item.mainBodyId}.${item.categoryId}.${item.attributesId}`
              })),
              mainBodyId: `${this.projectId}.${item.mainBodyId}`
          }))
          if(this.echoCheckedDataSubjectList.length === 0) return this.fullscreenLoading = false

        })
    },

    // 打开关联字段弹窗
    relationBtn(row) {
      this.fullscreenLoading = true
      this.isShow = false
      this.active = 0
      this.projectId = row.projectId
      this.relationDialogSize = row.relationDialogSize || this.relationDialogSize
      this.relationTitle = `<i class="${row.projectIcon}"></i> <span style="font-weight: 700;">${row.projectName}</span> ${this.$t('assetsManagement.关联字段')}`
      this.relationDialog = true
      const Api = this.isAssets ? this.getAssetsProjectAttributesListByProjectId(this.projectId) : this.getProjectAttributesListByProjectId({projectId:this.projectId, sceneId:row.sceneId})
      Api.then(()  => {
        this.saveBtnText = this.echoCheckedDataSubjectList.length ? this.$t('assetsManagement.修改') : this.$t('assetsManagement.保存')
        this.isShow = true

      })
    },

    // 提交关联字段
    relationFormSubmit() {
        if (!this.isAssets) {
            const attrs = this.$refs.selectField.getAttrs()
            this.$refs.fieldRelation.init(attrs)
        }
      this.fullscreenLoading = true
      this.$refs.fieldRelation.saveCurd(this.isAssets)
    },
    // 子组件数据保存成功
    saveSuccess(data) {
      this.fullscreenLoading = false
      if(data === 'error') return
      const attrs = this.$refs.selectField.getAttrs()
      this.$emit('saveSuccess', data, attrs)
      this.relationDialog = false
    },

  },
};
</script>

<style lang="scss" scoped>
::v-deep  .avue-icon i {
  font-size: 16px !important;
}


.header {
  display: flex;
  align-items: center;
}

</style>
