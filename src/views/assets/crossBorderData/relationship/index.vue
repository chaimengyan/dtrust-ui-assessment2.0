<template>
    <div class="evaluation">
        <el-form ref="relationshipFormRef" :model="relationshipForm" label-width="120px">
            <el-form-item label="业务活动名称：">
                <el-input v-model="relationshipForm.name" placeholder="请输入业务活动名称" />
            </el-form-item>
            <el-form-item label="业务活动描述：">
                <el-input v-model="relationshipForm.description" type="textarea" :rows="2" placeholder="请输入业务活动描述" />
            </el-form-item>
        <!-- <el-button  @click="addEvaluation">添加资产关联组</el-button> -->

        <div class="evaluation-content">
            <div class="evaluation-item" >
                <div class="evaluation-item-content">
                    <span class="mr-12">{{ 1 }}. </span>
                    涉及的资产：
                    <el-select v-model="relationshipForm.assets" :disabled="false" placeholder="请选择涉及的资产" clearable multiple filterable class="mr-12 flex">
                        <el-option
                            v-for="item in assetsList"
                            :key="item.projectId"
                            :label="item.projectName"
                            :value="item.projectId"
                        />
                    </el-select>
                    <el-button type="primary" icon="el-icon-plus" circle></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle></el-button>
                </div>

                <div class="assets-card" v-if="relationshipForm.assets.length !==0">
                    <div class="assets-card-header">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <el-button v-if="checkedAssets.length !==0" icon="el-icon-edit" @click="editAssets" circle></el-button>
                    </div>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="checkedAssets" @change="handleCheckedAssetsChange">
                        <el-checkbox 
                            v-for="assets in assetsList.filter(a=>relationshipForm.assets.includes(a.projectId))" 
                            :label="assets.projectName" 
                            :key="assets.projectId">{{assets.projectName}}</el-checkbox>
                    </el-checkbox-group>
                </div>

                <div class="assets-card" v-if="relationshipForm.assets.length !==0">
                    <el-form-item :label="$t('businessScenarioManagement.数据处理活动')" >
                        <el-cascader
                            v-model="relationshipForm.activitiesIdList"
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
                            :activitiesList="relationshipForm.assetsSceneProjectAttributesActivitiesList"
                            />
                    </el-form-item>
                </div>
                
                <RelationshipComponent 
                     />
            </div>
        </div>
    </el-form>
    <el-dialog
        :title="$t('fieldManagement.资产信息')" 
        width="40%" 
        :visible.sync="editAssetsDialog" 
        append-to-body
        :close-on-click-modal="false" 
        :fullscreen="isFullscreen">
        <div class="dialog-header" slot="title">
            <span class="dialog-header-title">{{$t('fieldManagement.资产信息')}}</span>
            <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
                <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
            </div>
        </div> 
          <AssetsInfo />
          <span slot="footer" class="dialog-footer">
            <!-- <el-button
              type="primary"
              icon="el-icon-circle-check"
              v-loading.fullscreen.lock="fullscreenLoading"
              @click="sumbitDataSubject">{{$t('assetsManagement.修改')}}</el-button>
            <el-button 
              icon="el-icon-circle-close"
              @click="dataSubjectDialog = false">{{$t('assetsManagement.取消')}}</el-button> -->
  
          </span>
        </el-dialog>

    </div>
</template>

<script>
import { getAllAssetsProject } from "@/api/assets/assetsManagement";
import AssetsInfo from '@/views/assets/crossBorderData/relationship/assetsInfo'
import QuestionComponent from '@/views/assets/crossBorderData/relationship/question.vue'
import ActAnswers from "@/views/assets/businessScenarioManagement/actAnswers";
import { activitiesCategoryOptions } from "@/util/enum"
import { getAllAssetsActivities } from "@/api/assets/dataProcessingActivities";
import { isArray } from 'lodash'
import {deepClone} from '@/util/util'
import RelationshipComponent from '@/views/assets/crossBorderData/relationship/index'

export default {
    name: "relationship",
    components: {AssetsInfo, RelationshipComponent, QuestionComponent, ActAnswers },
    props: {
        qnId: {
            type: String,
            default: '',
        },
       
    },
    data() {
      return {
        relationshipForm: {
            name: '',
            description:'',
            assets: '',
            activitiesIdList: [],
            assetsSceneProjectAttributesActivitiesList: []
        },
        checkAll: false,
        checkedAssets: [],
        isIndeterminate: true,
        editAssetsDialog: false,
        isFullscreen: false,
        activitiesOptions: [],
        activitiesCategoryOptions,
        actList: [],

        evaluationList: [],
        questionList: [],
        conditions: [],
        assetsList: [],
      }
    },
    mounted() {
        this.init()
        this.getAllAssetsActivities()
    },
    methods: {
        init() {
            this.getAllAssetsProject()
            // getByQuestionnaire(props.qnId)
        },
        editAssets() {
            this.editAssetsDialog = true
        },

        handleCheckAllChange(val) {
            this.checkedAssets = val ? this.relationshipForm.assets : [];
            this.isIndeterminate = false;
        },
        handleCheckedAssetsChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.relationshipForm.assets.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.relationshipForm.assets.length;
        },

        addBlock(id) {
            this.$refs.questionRef[id].addBlock();
        },

        getAllAssetsProject() {
            getAllAssetsProject('').then(res => {
                this.assetsList = res.data.data
            })
        },

        // 添加逻辑
        addEvaluation() {
            const evaluation = this.createEvaluation()

            addPrefabricateApi(evaluation).then(res => {
                const { id } = res.data || {};
                
                    evaluation.id = id
                    this.evaluationList.push(res.data || {})

                    // nextTick(() => {
                    //     addBlock(id);
                    // })

            })
        },

        //====数据处理活动相关=====
        // 获取全部数据处理活动
        getAllAssetsActivities() {
            this.relationshipForm.assetsSceneProjectAttributesActivitiesList =  []
            this.relationshipForm.assetsSceneProjectAttributesActivitiesList.forEach((item, index) => {
                const isString =  typeof item.echoActivitiesValue === "string";

                this.$set(item, 'echoActivitiesValue', isString ? JSON.parse(item.echoActivitiesValue) : item.echoActivitiesValue)
                this.relationshipForm.activitiesIdList[index] = item.activitiesId
            })

            this.activitiesOptions = deepClone(this.activitiesCategoryOptions)
            getAllAssetsActivities().then(res => {
                this.actList = res.data.data
                this.actList.forEach((a, i) => {
                    const activitiesItem = this.relationshipForm.assetsSceneProjectAttributesActivitiesList.find(b => b.activitiesId === a.activitiesId)
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
        // 选择数据处理活动
        changeEvent(val) {
            // const data = this.isBatch ? this.rowList : [this.currentRow]
            // data.forEach(item => {
            //     this.keys.forEach(k => {
            //         item[k] = undefined
            //     })
            //     this.relationshipForm.assetsSceneProjectAttributesActivitiesList = item.assetsSceneProjectAttributesActivitiesList = this.actList.filter(a => {
            //         return this.relationshipForm.activitiesIdList.includes(a.activitiesId)
            //     })
            //     this.relationshipForm.assetsSceneProjectAttributesActivitiesList.forEach((item,index) => {
            //         if(!('echoActivitiesValue' in item)){
            //             if(item.activitiesType === 'radio') {
            //                 this.$set(item, 'echoActivitiesValue', 0)
            //             } else if(item.activitiesType === 'checkbox') {
            //                 this.$set(item, 'echoActivitiesValue', [])
            //             } else {
            //                 this.$set(item, 'echoActivitiesValue', '')
            //             }
            //         }
            //         if(!('answers' in item)){
            //             item.answers = JSON.parse(item.activitiesJson).answers
            //         }
            //     })
            // })
        },
        getShowValue(activitiesItem) {
            const { echoActivitiesValue } = activitiesItem || {}
            if (!echoActivitiesValue) {
                return echoActivitiesValue;
            }
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
    }
}





</script>

<style lang="scss" scoped>
.assets-card {
    margin-top:10px;
    background-color: #edf4ff;
    padding: 10px;
    border-radius: 8px;
    .assets-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center
    }
}
.evaluation {
    // width: 100%;
    // height: 600px;
    // overflow: scroll;
    display: flex;
    flex-direction: column;
    // justify-content: flex-end;
    .evaluation-content {
        margin-top: 40px;
        border: 1px solid #c7c7c7;
        border-radius: 4px;
        box-shadow: 2px 2px 4px #c7c7c7;
        .evaluation-item {
            padding: 12px;
            white-space: nowrap;
            color: #000;

            border-bottom: 1px solid #eee;

            
            .evaluation-item-content {
                display: flex;
                align-items: center;
                margin-bottom: 12px;

                .icon {
                    font-size: 20px;
                    cursor: pointer;

                    &.primary {
                        color: #409eff;
                    }

                    &.error {
                        color: red;
                    }
                }
            }

            .flex {
                width: 0;
                flex: 1;
            }

            .mr-12 {
                margin-right: 12px;
            }
        }
    }

}
</style>