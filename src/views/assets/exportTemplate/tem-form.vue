<template>
    <div>
        <el-form ref="temForm" :model="temForm" label-width="200px"   >
            
            <el-form-item :label="$t('exportTemplate.模板名称')" prop="templateName">
                <el-input v-model="temForm.templateName" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('crudCommon.描述')" prop="description">
                <el-input v-model="temForm.description" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('exportTemplate.模板类型')" prop="type">
                <el-select v-model="temForm.type"  clearable>
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('exportTemplate.文件类型')" prop="fileType">
                <el-select v-model="temForm.fileType" clearable>
                <el-option v-for="item in fileTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <template v-if='[0,1,2,3].includes(temForm.type)'>
                <el-form-item :label="$t('exportTemplate.是否展示评估基本信息')" prop="assessmentSimple">
                    <el-switch v-model="temForm.assessmentSimple" />
                </el-form-item>
                <el-form-item   el-form-item v-if='temForm.assessmentSimple' :label="$t('exportTemplate.评估基本信息排序')" prop="assessmentSimpleSort">
                    <el-input-number v-model="temForm.assessmentSimpleSort" controls-position="right" />
                </el-form-item>
                <el-form-item :label="$t('exportTemplate.是否展示评估内容')" prop="assessmentInfo">
                    <el-switch v-model="temForm.assessmentInfo" />
                </el-form-item>
                <el-form-item v-if='temForm.assessmentInfo' :label="$t('exportTemplate.评估内容排序')" prop="assessmentInfoSort">
                    <el-input-number v-model="temForm.assessmentInfoSort" controls-position="right" />
                </el-form-item>
                <el-form-item :label="$t('exportTemplate.是否展示评估统计图')" prop="riskChart">
                    <el-switch v-model="temForm.riskChart" />
                </el-form-item>
                <el-form-item v-if='temForm.riskChart' :label="$t('exportTemplate.评估统计图排序')" prop="riskChartSort">
                    <el-input-number v-model="temForm.riskChartSort" controls-position="right" />
                </el-form-item>
                <el-form-item :label="$t('exportTemplate.是否展示风险治理列表')" prop="riskList">
                    <el-switch v-model="temForm.riskList" />
                </el-form-item>
                <el-form-item :label="$t('exportTemplate.风险治理列表风险等级')" prop="riskListLevel">
                    <el-select v-model="temForm.riskListLevel" clearable>
                        <el-option v-for="item in riskListLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('exportTemplate.风险治理列表处理结果')" prop="riskListResult">
                    <el-select v-model="temForm.riskListResult" clearable>
                        <el-option v-for="item in riskListResultOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if='temForm.riskListResult !== null' :label="$t('exportTemplate.风险治理列表处理结果')" prop="riskListSort">
                    <el-input-number v-model="temForm.riskListSort" controls-position="right" />
                </el-form-item>
                <el-form-item v-if='[1,2,3].includes(temForm.type)' :label="$t('exportTemplate.是否展示评估记录')" prop="evaluationHistory">
                    <el-switch v-model="temForm.evaluationHistory" />
                </el-form-item>
                <el-form-item v-if='temForm.evaluationHistory' :label="$t('exportTemplate.是否展示评估记录')" prop="evaluationHistorySort">
                    <el-input-number v-model="temForm.evaluationHistorySort" controls-position="right" />
                </el-form-item>
            </template>
            
            <template v-if='[2,3,5].includes(temForm.type)'>
                <el-form-item :label="$t('exportTemplate.是否展示业务活动的基本信息')" prop="sceneSimple">
                    <el-switch v-model="temForm.sceneSimple" />
                </el-form-item>
                <el-form-item v-if='temForm.sceneSimple' :label="$t('exportTemplate.业务活动的基本信息排序')" prop="sceneSimpleSort">
                    <el-input-number v-model="temForm.sceneSimpleSort" controls-position="right" />
                </el-form-item>
                <el-form-item :label="$t('exportTemplate.是否展示业务活动统计图')" prop="sceneChart">
                    <el-switch v-model="temForm.sceneChart" />
                </el-form-item>
                <el-form-item v-if='temForm.sceneChart' :label="$t('exportTemplate.业务活动统计图排序')" prop="sceneChartSort">
                    <el-input-number v-model="temForm.sceneChartSort" controls-position="right" />
                </el-form-item>
                <el-form-item :label="$t('exportTemplate.是否展示业务活动字段列表')" prop="sceneAttribute">
                    <el-switch v-model="temForm.sceneAttribute" />
                </el-form-item>
                <el-form-item v-if='temForm.sceneAttribute' :label="$t('exportTemplate.业务活动字段列表排序')" prop="sceneAttributeSort">
                    <el-input-number v-model="temForm.sceneAttributeSort" controls-position="right" />
                </el-form-item>
            </template>

            <template v-if='[1,3,4].includes(temForm.type)'>
                <el-form-item :label="$t('exportTemplate.是否展示资产的基本信息')" prop="assetsSimple">
                    <el-switch v-model="temForm.assetsSimple" />
                </el-form-item>
                <el-form-item v-if='temForm.assetsSimple' :label="$t('exportTemplate.资产的基本信息排序')" prop="assetsSimpleSort">
                    <el-input-number v-model="temForm.assetsSimpleSort" controls-position="right" />
                </el-form-item>
                <el-form-item :label="$t('exportTemplate.是否展示资产统计图')" prop="assetsChart">
                    <el-switch v-model="temForm.assetsChart" />
                </el-form-item>
                <el-form-item v-if='temForm.assetsChart' :label="$t('exportTemplate.资产统计图排序')" prop="assetsChartSort">
                    <el-input-number v-model="temForm.assetsChartSort" controls-position="right" />
                </el-form-item>
                <el-form-item :label="$t('exportTemplate.是否展示资产字段列表')" prop="assetsAttribute">
                    <el-switch v-model="temForm.assetsAttribute" />
                </el-form-item>
                <el-form-item v-if='temForm.assetsAttribute' :label="$t('exportTemplate.资产字段列表排序')" prop="assetsAttributeSort">
                    <el-input-number v-model="temForm.assetsAttributeSort" controls-position="right" />
                </el-form-item>
            </template>

            <template v-if='temForm.type === 6'>
                <el-form-item :label="$t('exportTemplate.是否展示主体权利图表')" prop="rightChart">
                    <el-switch v-model="temForm.rightChart" />
                </el-form-item>
                <el-form-item v-if='temForm.rightChart' :label="$t('exportTemplate.主体权利图表排序')" prop="rightChartSort">
                    <el-input-number v-model="temForm.rightChartSort" controls-position="right" />
                </el-form-item>
            </template>
            <!-- <el-form-item label="是否展示隐私条款" prop="privacyPolicy">
                <el-switch v-model="temForm.privacyPolicy" />
            </el-form-item> -->
            <el-form-item :label="$t('exportTemplate.是否添加水印')" prop="watermark">
                <el-switch v-model="temForm.watermark" />
            </el-form-item>
            <el-form-item v-if='temForm.watermark' :label="$t('exportTemplate.水印信息')" prop="watermarkInfo">
                <el-input v-model="temForm.watermarkInfo" :placeholder="$t('exportTemplate.非必填默认为公司名')" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('exportTemplate.是否加密')" prop="encrypt">
                <el-switch v-model="temForm.encrypt" />
            </el-form-item>
            <el-form-item v-if='temForm.encrypt' :label="$t('exportTemplate.加密密码')" prop="encryptKey">
                <el-tooltip
                class="box-item"
                effect="dark"
                :content="$t('exportTemplate.默认是当前账号置空也默认是当前账号')"
                placement="top">
                    <el-input v-model="temForm.encryptKey" clearable></el-input>
                </el-tooltip>
            </el-form-item>
            </el-form>
    </div>
  </template>
  
  <script>
    import {mapGetters} from 'vuex'
  
    export default {
      name: 'tem-form',
      props: {
        temFormData: {
            type: Object,
            default: () => {}
        },
        formType: {
            type: String,
            default: 'add'
        }
    },
      data() {
        return {
            fileTypeOptions: [
                {
                    label: 'pdf',
                    value: 'pdf'
                }
            ],
            typeOptions: [
                {
                    label: this.$t('exportTemplate.通用评估模板'),
                    value: 0
                },
                {
                    label: this.$t('exportTemplate.资产评估模板'),
                    value: 1
                },
                {
                    label: this.$t('exportTemplate.业务活动评估模板'),
                    value: 2
                },
                {
                    label: this.$t('exportTemplate.资产业务活动评估模板'),
                    value: 3
                },
                {
                    label: this.$t('exportTemplate.资产信息模板'),
                    value: 4
                },
                {
                    label: this.$t('exportTemplate.业务活动信息模板'),
                    value: 5
                },
                {
                    label: this.$t('exportTemplate.个人主体权利模板'),
                    value: 6
                },
            ],
            riskListLevelOptions: [
                {
                    label: this.$t('exportTemplate.所有'),
                    value: 0
                },
                {
                    label: this.$t('crudCommon.极高'),
                    value: 1
                },
                {
                    label: this.$t('crudCommon.高'),
                    value: 2
                },
                {
                    label: this.$t('crudCommon.中'),
                    value: 3
                },
                {
                    label: this.$t('crudCommon.低'),
                    value: 4
                },
                {
                    label: this.$t('exportTemplate.中及以上'),
                    value: 5
                },
            ],
            riskListResultOptions: [
                {
                    label: this.$t('exportTemplate.所有'),
                    value: 0
                },
                {
                    label: this.$t('exportTemplate.待处理'),
                    value: 1
                },
                {
                    label: this.$t('exportTemplate.已处理'),
                    value: 2
                },
                {
                    label: this.$t('exportTemplate.已完结'),
                    value: 3
                },
                {
                    label: this.$t('exportTemplate.另指派'),
                    value: 4
                },
                {
                    label: this.$t('exportTemplate.已过期'),
                    value: 5
                },
            ],
            temForm: {
                templateName: '',
                description: '',
                type: null,
                fileType: 'pdf',
                assessmentSimple: false,
                assessmentSimpleSort: 1,
                assessmentInfo: false,
                assessmentInfoSort: 2,
                riskChart: false,
                riskChartSort: 3,
                riskList: false,
                riskListLevel: 0,
                riskListResult: 0,
                riskListSort: 4,
                assetsSimple: false,
                assetsSimpleSort: 5,
                assetsChart: false,
                assetsChartSort: 6,
                sceneSimple: false,
                sceneSimpleSort: 7,
                sceneChart: false,
                sceneChartSort: 8,
                evaluationHistory: false,
                evaluationHistorySort: 9,
                sceneAttribute: false,
                sceneAttributeSort: 10,
                assetsAttribute: false,
                assetsAttributeSort: 11,
                rightChart: false,
                rightChartSort: 12,
                // privacyPolicy: true,
                watermark: false,
                watermarkInfo: '',
                encrypt: false,
                encryptKey: ''
            }
        }
      },
      computed: {
        ...mapGetters(['permissions', 'userInfo']),
        
      },
      created() {
        this.temForm.encryptKey = this.userInfo.username
      },
      methods: {
        echoEvent() {
            this.temForm = this.formType === 'add' ? this.temForm : {...this.temFormData}
            console.log(this.temForm ,this.formType,this.temFormData,'temFormtemForm');
        },
        formData() {
            return this.temForm
        },
      }
    }
  </script>
  
  <style lang="scss" scoped>
  .itemBox{
  }
  </style>