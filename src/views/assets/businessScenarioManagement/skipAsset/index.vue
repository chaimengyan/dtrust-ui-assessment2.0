<template>
    <div>
        <el-drawer size="100%" v-if="relationDialog" :visible.sync="relationDialog">
            <div class="drawer-header" slot="title">
                <span class="drawer-header-title" v-html="relationTitle"></span>
                <div class="drawer-header-screen" @click="() => isFullscreen = !isFullscreen">
                <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
                </div>
            </div>
            <el-steps :active="active" style="width: 60%;margin: 0 auto;" simple finish-status="success">
            <el-step :title="$t('assetsManagement.选择数据主体')"></el-step>
                <el-step :title="$t('assetsManagement.选择字段')"></el-step>
                <el-step :title="$t('assetsManagement.字段配置')"></el-step>
            </el-steps>
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
                <ActRelation
                    v-show="active === 2"
                    ref="actRelation"
                    :sceneId="sceneId"
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
                    v-if="active !== 2"
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
    </div>
</template>

<script>
import {
    addOrUpdateStepAsset,
    getAttributesBySceneId
} from "@/api/assets/businessScenarioManagement";
import  DataSubject from "@/views/assets/assetsManagement/dataSubject";
import  SelectField from "@/views/assets/assetsManagement/selectField";
import  ActRelation from "@/views/assets/businessScenarioManagement/actRelation";
export default {
    name: "SkipAsset",
    components: {
        DataSubject,
        SelectField,
        ActRelation
    },
    props: {
    
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
            isFullscreen: false,
            isShow: false,
            disabledKeys: null,
            relationDialogSize: '100%'
        };
    },

    created() {
    
    },
    methods: {
        
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
        getAttributesBySceneId(id) {
            return getAttributesBySceneId(id).then(res => {
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
            this.sceneId = row.sceneId
            this.relationDialogSize = row.relationDialogSize || this.relationDialogSize
            this.relationTitle = `<i class="${row.projectIcon}"></i> <span style="font-weight: 700;">${row.projectName}</span> ${this.$t('assetsManagement.关联字段')}`
            this.relationDialog = true
            getAttributesBySceneId(this.sceneId).then(()  => {
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

    }
}
</script>
<style lang="scss" scoped>
    
</style>