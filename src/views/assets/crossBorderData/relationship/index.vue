<template>
    <div class="evaluation">
        <el-button  @click="addEvaluation">添加规则</el-button>

        <div class="evaluation-content">
            <div class="evaluation-item" v-for="(item, index) in evaluationList" :key="item.qnId">
                <div class="evaluation-item-content">
                    <span class="mr-12">{{ index + 1 }}. </span>
                    当前问卷：
                    
                    <div class="mr-12">符合以下</div>
                    
                    <div>条件时触发此问卷：</div>
                    <el-select :disabled="false" v-model="item.nextQnId" @update:model-value="updateEvaluation(item)" placeholder="请选择需要被触发的问卷" class="mr-12 flex">
                        <el-option
                            v-for="item in qnList"
                            :key="item.id"
                            :label="item.qnName"
                            :value="item.id"
                        />
                    </el-select>
                    <!-- <el-icon class="mr-12 icon primary" @click="addConditions(item.id)"><CirclePlusFilled /></el-icon> -->
                    <!-- <el-icon v-if="!item.logicGroupTree?.length" class="mr-12 icon primary" @click="addBlock(item.id)"><CirclePlusFilled /></el-icon> -->

                    <!-- <el-icon class="icon error" @click="removeEvaluation(item.id)"><RemoveFilled /></el-icon> -->
                </div>
                <!-- <QuestionComponent 
                    :ref="v => questionRef[item.id] = v" 
                    :is-view="false"
                    :evaluation="item"
                    :bind-block-list="item.logicGroupTree? [item.logicGroupTree] : []" 
                    :questionList="questionList" /> -->
            </div>
        </div>
    </div>
</template>

<script >

// import QuestionComponent from '@/views/assets/crossBorderData/relationship/question.vue'
export default {
    name: "relationship",
    // components: { QuestionComponent },
    props: {
        qnId: {
            type: String,
            default: '',
        },
       
    },
    data() {
      return {
        evaluationList: [],
        questionList: [],
        conditions: [],
        qnList: [],
      }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            // getQuestionsByQnId(this.qnId)
            // getByQuestionnaire(props.qnId)
        },

        addBlock(id) {
            this.$refs.questionRef[id].addBlock();
        },

        // 获取评估触发逻辑列表
        getByQuestionnaire(qnId) {
            getByQuestionnaireApi(qnId).then(res => {
                if (res.data.data) {
                    this.evaluationList = res.data.data
                    this.conditions = res.data?.map((item) => item.conditions).flat()
                }
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


        updateEvaluation(item) {
            this.putPrefabricateApi(item)
        },

        removeEvaluation(id) {
            this.delPrefabricateApi(id).then(this.init)
        },

        addConditions(prefabricateId) {
            const data = this.createConditions(prefabricateId)
            return addConditionApi(data).then(res => {
                const { id } = res.data || {};
                data.id = id;
                this.conditions.push(data)
            })
        },


        createConditions(prefabricateId) {
            return {
                prefabricateId, 
                questionId: '', 
                expression: '',
                triggerType: 0,
                value: 0,
            }
        },

        createEvaluation() {
            return {
                qnId: this.qnId,
                nextQnId: '',
            }
        },

        filterConditions(item) {
            return this.conditions.filter(qt => qt.prefabricateId === item.id)
        },

        // 获取问卷列表
        getQnList(qnCategories) {
            const categoryIds = qnCategories.map(x=>x.id).join()
            getQnListApi({categoryIds}).then(res => {
                this.qnList = res.data
            })
        },
        // 获取问题列表
        getQuestionsByQnId(qnId) {
            getListQuestionByQnIdApi(qnId).then(res => {
                this.questionList = res.data.filter(x=> {
                    return !(x.isNature || ["PERSONAL_DATA", "SCENE_INVENTORY", "ASSETS_INVENTORY"].includes(x.componentType))
                })
            })
        },
    }
}





</script>

<style lang="scss" scoped>

.evaluation {
    width: 100%;
    height: 600px;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    // justify-content: flex-end;
    .evaluation-content {
        margin-top: 40px;

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