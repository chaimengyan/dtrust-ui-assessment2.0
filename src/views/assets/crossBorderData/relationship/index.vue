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
            <el-button type="primary" icon="el-icon-plus" circle @click="handleAddQuestion"></el-button>
            <relation-question v-model="relationshipForm.questionList" />
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
import RelationQuestion from '@/views/assets/crossBorderData/relationship/question.vue'
import ActAnswers from "@/views/assets/businessScenarioManagement/actAnswers";
import { activitiesCategoryOptions } from "@/util/enum"
import { getAllAssetsActivities } from "@/api/assets/dataProcessingActivities";
import { isArray } from 'lodash'
import {deepClone} from '@/util/util'

export default {
    name: "relationship",
    components: {AssetsInfo, RelationQuestion, ActAnswers },
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
            assetsSceneProjectAttributesActivitiesList: [],
            questionList: [{id: 1}]
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

        handleAddQuestion() {
            this.relationshipForm.questionList.push({
                id: Math.random()
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

}
</style>