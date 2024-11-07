<template>
    <div>
        <div v-for="(b, index) in blockList" :key="b.id">
            <div class="evaluation-item-block">
                <div class="evaluation-item-block-title">
                    <template v-if="!isView" >
                        <el-button size="small" class="ml-2" @click="addChild(b)">添加逻辑组</el-button>
                        <el-button size="small" class="mr-2" @click="addConditions(b.id)">添加条件</el-button>
                    </template>
                    <div v-if="!b.logic">
                        <div style="display:inline-block;margin-left: 20px;">有</div><el-input-number style="margin: auto 8px" :disabled="isView" size="small" v-model="b.count" @update:model-value="updateLogicGroup(b)"></el-input-number>个满足即可触发
                    </div>

                    <!-- <el-icon v-if="!isView" class="icon error" @click="removeLogicGroup(b.id)"><RemoveFilled /></el-icon> -->
                </div>
                <div class="evaluation-item-content" v-for="qt in b.conditions" :key="qt?.id">
                    <el-row :gutter="20"  class="mr-12 flex" >
                        <el-col :span="4">
                            <el-select 
                                :disabled="isView"
                                v-model="qt.triggerType" 
                                @update:model-value="updateConditions(qt)" 
                                placeholder="请选择触发条件类型" 
                                size="small">
                                <el-option
                                    v-for="item in triggerTypeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-col>
                        <el-col v-if="qt.triggerType !== 1" :span="6">
                            <el-select 
                                :disabled="isView"
                                :placeholder="`请选择问题`" 
                                v-model="qt.questionId" 
                                @update:model-value="updateConditions(qt)" 
                                size="small">
                                <el-option
                                    v-for="item in questionList"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id"
                                />
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            <el-select :disabled="isView" v-model="qt.expression" @update:model-value="updateConditions(qt)" size="small">
                                <el-option
                                    v-for="item in Expression[qt.triggerType]"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            <template v-if="qt.triggerType === 2">
                                <el-input :disabled="isView" v-if="qtType(qt.questionId) === ComponentType.input" size="small" v-model="qt.value" @update:model-value="updateConditions(qt)"></el-input>
                                <el-select :disabled="isView" v-else-if="optionTypes.includes(qtType(qt.questionId))" size="small" v-model="qt.value" @update:model-value="updateConditions(qt)">
                                    <el-option
                                        v-for="item in qtOption(qt.questionId)"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </template>
                            <template v-else >
                                <el-input-number :disabled="isView" size="small" v-model="qt.value" @update:model-value="updateConditions(qt)"></el-input-number>
                            </template>
                        </el-col>
                    </el-row>
                    <template v-if="!isView" >
                        <!-- <el-icon class="mr-12 icon primary" @click="addConditions(b.id)"><CirclePlusFilled /></el-icon> -->
                        <!-- <el-icon class="icon error" @click="removeConditions(b.id, qt)"><RemoveFilled /></el-icon> -->
                    </template>
                </div>
        
                <Question 
                    :ref="v => childRef[b.id] = v" 
                    :isView="isView"
                    :level="level + 1" 
                    :questionList="questionList" 
                    :logicGroupId="b.id" 
                    :evaluation="evaluation" 
                    :bindBlockList="b.groups" />
            </div>
        </div>
    </div>
</template>

<script>
import Question from '@/views/assets/crossBorderData/relationship/question.vue'

export default {
    name: "question",
    components: { Question },
    props: {
        isView: {
            type: Boolean,
            default: false
        },
        questionList: {
            type: Array,
            default: () => []
        },
        bindBlockList: {
            type: Array,
            default: () => []
        },
        level: {
            type: Number,
            default: 1
        },
        evaluation: {
            type: Object,
            default: () => {}
        },
        logicGroupId: {
            type: Number,
            default: 0
        }
       
    },
    data() {
      return {
        blockList: [],
        triggerTypeOptions: [{
            label: '题目分数',
            value: 0
        },
        {
            label: '总分',
            value: 1
        },
        {
            label: '题目选项',
            value: 2
        }],
        logicTypeOptions: [ {
            label: '全部',
            value: 'and'
        },
        {
            label: '任意',
            value: 'or'
        }],
        qnList: [],
      }
    },
    mounted() {
    },
    methods: {
        qtType(id) {
            const item = this.questionList.find(item => item.id === id);
            
            return item?.componentType;
        },


        qtOption(id) {
            const item = this.questionList.find(item => item.id === id);
            return item?.options || [];
        },

        findIndex(id) {
            return this.blockList.findIndex(qt => qt.id === id)
        },

        addConditions(id) {
            const index = this.findIndex(id);
            if (index !== -1) {
                const group = this.blockList[index];
                // if (group.groups?.length) {
                //     return ElMessage.warning('请删除分组，再添加条件')
                // } 
                // 调用接口替换
                const data = createConditions(this.evaluation.id, group.id)
                data = data.toString();
                addConditionApi(data).then(res => {
                    const { id } = res.data || {};
                    data.id = id;
                    if (!group.conditions) {
                        group.conditions = []
                    }
                    group.conditions.push(data)
                })
            }
        },
        removeLogicGroup(id) {
            removeLogicApi(id).then(() => {
                const index = this.blockList.findIndex(item => item.id === id);
                if (index !== -1) {
                    this.blockList.splice(index, 1);
                }
            })
        },

        updateLogicGroup(group) {
            // putLogicApi({ id: group.id, logic: group.logic ? LogicType.and : LogicType.or, count: group.count === null ? null : group.count } as Logic)
        },


        removeConditions(id, qt) {
            const index = findIndex(id);
            if (index !== -1) {
                const list = this.blockList[index].conditions
                const i = list.findIndex(item => item.id === qt.id)
                if (i !== -1) {
                    delConditionApi(qt.id).then(() => {
                        // 调用接口替换
                        list.splice(i, 1)
                        
                        if (!list.length && !this.blockList[index].groups?.length) {
                            this.blockList.splice(index, 1)
                            this.removeLogicGroup(id)
                        }
                    })
                }
            }
        },


        addChild(item) {
            // if (item.conditions?.length) {
            //     return ElMessage.warning('请删除条件，再添加逻辑分组')
            // }
            this.$refs.childRef[item.id].addBlock();
        },
        addBlock() {
            const data = this.createLogic();
            addLogicApi(data).then(res => {
                const { groups, conditions, ...result } = res.data || {}
                this.blockList.push({  groups: groups || [], conditions: conditions || [], ...result })
            })
        },


        updateConditions(item) {
            this.putConditionApi(item);
        },

        createConditions(prefabricateId, logicGroupId) {
            return {
                prefabricateId, 
                questionId: '',
                logicGroupId,
                expression: '',
                triggerType: 0,
                value: '0',
            }
        },

        createLogic() {
            return {
                id: '',
                prefabricateId: this.evaluation.id,
                level: this.level,
                logicGroupId: this.logicGroupId,
                logic: LogicType.or,
                count: null
            }
        },
    },
}

</script>
<style lang="scss" scoped>
.evaluation-item-block {
    padding: 12px;
    margin-bottom: 12px;
    border: 1px solid #c7c7c7;
    border-radius: 4px;
    background-color: white;
    box-shadow: 2px 2px 4px #c7c7c7;
    .evaluation-item-block-title {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        .icon {
            font-size: 20px;
            cursor: pointer;
            &.error {
                color: red;
                margin-left: auto;
            }
        }
    }
    
    .evaluation-item-content {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .icon {
            font-size: 20px;
            cursor: pointer;

            &.primary {
                margin-left: auto;
                color: #409eff;
            }

            &.error {
                color: red;
            }
        }
    }

   
}

.mb-12 {
    margin-bottom: 12px;
}
</style>