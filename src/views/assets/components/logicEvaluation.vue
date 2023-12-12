<template>
    <div>
        <el-dialog v-if="visible"  size="450px" :title="qnList.find(x=> x.id===this.qnId).qnName" @closed="closed">
            <el-collapse v-model="active" @change="handleChange">
                <el-collapse-item 
                    v-for="item in evaluationList" 
                    :key="item.id" 
                    :title="qnList.find(x=> x.id===item.nextQnId).qnName" 
                    :name="item.id">
                    <el-form label-width="100px" label-suffix=" :" ref="ruleFormChildRefs" :model="item" :rules="rules">
                        <el-form-item label="评估名称" prop="evaluationName">
                            <el-input v-model="item.evaluationName" placeholder="请填写评估名称" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="指派方式">
                            <el-switch
                            v-model="item.mode"
                            class="ml-2"
                            inline-prompt
                            style="--el-switch-on-color: #46aee7; --el-switch-off-color: #13ce66"
                            active-text="按章节"
                            inactive-text="按问卷"
                            :active-value="2"
                            :inactive-value="1"
                            @change="changeMode(item)"
                            />
                        </el-form-item>
                        <el-form-item label="问卷有效期" prop="validTime">
                            <el-input-number v-model="item.validTime" placeholder="请填写问卷有效期(小时)"></el-input-number>小时
                        </el-form-item>
                        <el-form-item v-if="item.mode === 2" label="被评估人" prop="evaluators">
                            <el-cascader 
                            placeholder="请选择被评估人"
                            v-model="item.evaluators"
                            :options="options" 
                            :props="{ multiple: true }" 
                            @visible-change="getChapterByQnId(item.nextQnId)" 
                            clearable />
                        </el-form-item>
                        <el-form-item v-else label="被评估人" prop="evaluators">
                            <el-select v-model="item.evaluators" placeholder="请选择被评估人" clearable multiple>
                                <el-option v-for="item in userList" :key="item.userId" :label="item.nickName" :value="item.userId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审核人" prop="auditorIds">
                            <el-select v-model="item.auditorIds" placeholder="请选择审核人" clearable multiple>
                                <el-option v-for="item in userList" :key="item.userId" :label="item.nickName" :value="item.userId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审核方式">
                            <el-switch
                                v-model="item.sign"
                                class="ml-2"
                                inline-prompt
                                style="--el-switch-on-color: #46aee7; --el-switch-off-color: #13ce66"
                                active-text="或签"
                                inactive-text="并签"
                                :active-value="0"
                                :inactive-value="1"
                                />
                        </el-form-item>
                    </el-form>
                    
                    <el-button v-if="childEvaluationList.length !== 0" @click="handleOpenChild(item.nextQnId)">配置下一级评估</el-button>

                </el-collapse-item>
            </el-collapse>

            <template #footer>
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </template>
        </el-dialog>

        <logicEvaluation
            v-if="childQnId"
            ref="childRef"
            :qn-id="childQnId"
            :evaluation-list="childEvaluationList"
            @closed="onChildClose"
            @success="onChildSuccess"
        />
    </div>
 
</template>


<script>
import { 
    getChapterByQnIdApi, 
    getByQuestionnaireApi, 
    getUserList } from "@/api/assets/components/releaseForm";
import LogicEvaluation from "@/views/assets/components/logicEvaluation";
import {mapGetters} from "vuex";
export default {
    name: "LogicEvaluation",
    components: {
        LogicEvaluation
    },
    props: {
        evaluationList: {
            type: Array,
            default: () => []
        },
        qnList: {
            type: Array,
            default: () => [],
        },
        qnId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            // 启动表单
            releaseForm: {},
            // 下拉选择问卷
            qnOptions: [],
            // 被评估人列表
            userList: [],
            chapterOptions: [],
            options: [],
            childEvaluationList: [],
            active: '',
            childQnId: '',
            visible: false,
            rules: {
                evaluationName: [{ required: true, message: "请填写评估名称" }],
                auditorIds: [{ required: true, message: "请选择审核人" }],
                evaluators: [{ required: true, message: "请选择被评估人" }],
            },
        };
    },
    watch: {
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    created() {
        this.getUserList()
    },
    methods: {
        changeMode(item) {
            item.evaluators = []
        },
        handleChange(val) {
            if(val.length !== 0) {
                const evaluation = this.evaluationList.find(x => x.id === val[val.length-1])
                this.getByQuestionnaire(evaluation.nextQnId)
            }
            
        },
        closed() {
            this.$emit('closed')
        },
        onChildClose() {
            this.childQnId = ''
        },
        setVisible(value) {
            this.visible = value;
            if (value) {
                this.getUserList();
            }
        },
        onChildSuccess(data) {
            const item = this.evaluationList.find(item => item.nextQnId === this.childQnId)
            if (item) {
                item.prefabricates = data;
            }
        },
        getByQuestionnaire(qnId) {
            getByQuestionnaireApi(qnId).then(res => {
                this.childEvaluationList = res.data.data.filter(x => x.nextQnId)
            })
        },
        handleOpenChild(qnId) {
            this.childQnId = qnId;
            this.$nextTick(() => {
                this.childRef.setVisible(true)
            })
        },
        getChapterByQnId(qnId) {
            getChapterByQnIdApi(qnId|| '').then(res => {
                this.chapterOptions = res.data.data
                const map = this.userList.map(item => ({ label: item.nickName, value: item.userId }))

                this.options = this.chapterOptions.map((item) =>{
                    return {
                        label: item.title,
                        value: item.id,
                        children: map,
                    }
                });
            })
        },
        handleSubmit() {
            if (!ruleFormChildRefs.length) return Promise.resolve();
                const result = Promise.allSettled(ruleFormChildRefs.map(el => el.validate()));
                return result.then(res => {
                    const isReject = res.every(v => !v.value)

                    if (isReject) {
                        return Promise.reject();
                    }
                        
                    const result = res.map((res) => {
                    if (!res) return null;
                    const item = this.evaluationList[i];
                    return {
                        prefabricateId: item.id,
                        validTime: item.validTime,
                        evaluationName: item.evaluationName,
                        auditorIds: item.auditorIds,
                        sign: item.sign,
                        mode: item.mode,
                        prefabricates: item.prefabricates || [],
                        evaluators: item.evaluators.map(x => {
                            return { userId: item.mode === 2 ? x[1] : x, sort: 0, chapterId: item.mode === 2 ? x[0] : '' }
                        }),
                    }
                }).filter(v => v);
                this.$emit('success', result)
                this.setVisible(false)
            }).catch(() => {
                this.$message.error('还有必填配置没有填写！')
            })
        },
        // 获取全部用户
        getUserList() {
            getUserList().then(res => {
                this.userList = res.data.data
            })
        },
       
    }
}



</script>