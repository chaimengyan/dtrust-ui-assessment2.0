<template>
   <div>
    <avue-form
            ref="releaseForm"
            :option="releaseFormOption"
            v-model="releaseForm" 
        >
            <template slot="qnId">
                <avue-select
                    v-model="releaseForm.qnId" 
                    :placeholder="`${$t('crudCommon.请选择')}${$t('evaluationRecord.问卷')}`" 
                    filterable
                    :dic="queOptions"
                    :props="defaultQnIdProps"></avue-select>
            </template>
            <template slot="evaluatorsHandle">
                <el-select
                        v-model="releaseForm.evaluatorsHandle"
                        multiple
                        filterable
                        allow-create
                        default-first-option
                        value-key="userId"
                        :placeholder="`${$t('crudCommon.请选择')}${$t('evaluationRecord.被评估人')}`" >
                        <el-option
                            v-for="item in evaluatorList"
                            :key="item.userId"
                            :label="item.nickName"
                            :value="item">
                                <span style="float: left">{{ item.nickName }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mail || item.phone }}</span>
                        </el-option>
                    </el-select>
            </template>
        </avue-form>
   </div>
</template>
<script>
import {
  getQuestionnaireList,
  releaseAssessQuestionnaire,
  getUserList
} from "@/api/assets/components/releaseForm";
import {isMobile, isEmail} from '@/util/validate'
import {getObjType} from '@/util/util.js'
import {releaseFormOption} from "@/const/crud/components/releaseForm";
import {mapGetters} from "vuex";

export default {
    name: "ReleaseForm",
    props: {
      typeIds: {
        type: Number,
        default: 0
      },
      evaluationItem: {
        type: Object,
        default: () => {}
      },
    },
    data() {
        return {
            // 启动表单
            releaseForm: {},
            // 下拉选择问卷
            queOptions: [],
            // 被评估人列表
            evaluatorList: [],
            defaultQnIdProps: {
                label: "qnName",
                value: "id"
            },
        };
    },
    watch: {
    },
    computed: {
            ...mapGetters(["userInfo"]),
            releaseFormOption() {
                return releaseFormOption(this)
            },
    },
    created() {
        this.initReleaseForm()
        this.getQuestionnaireList(this.typeIds)
        this.getUserList()
    },
    methods: {
        initReleaseForm() {
                this.releaseForm = {
                    // 评估名称
                    assessName: '',
                    // 所选问卷
                    qnId: '',
                    // 处理后的被评估人
                    evaluators: [],
                    // 处理前的被评估人
                    evaluatorsHandle: [],
                    // 问卷截止时间
                    endTime: '',
                }
            },
        // 获取全部用户
        getUserList() {
            getUserList().then(res => {
                this.evaluatorList = res.data.data
            })
        },
        // 下拉获取问卷名称列表
            getQuestionnaireList(typeIds, keyword) {
                getQuestionnaireList(
                    { 
                        typeIds,
                        keyword
                    }
                ).then(res => {
                    this.queOptions = res.data.data.map(item => {
                        const {id, qnName} = item
                        const obj = {id, qnName}
                        return obj
                    });
                });
            },
        // 确定启动评估
            releaseSave() {
                this.$refs.releaseForm.validate((valid, done,msg) => {
                     if (valid) {
                        // this.releaseForm.auditorId = this.userInfo.userId
                        this.releaseForm.url = `http://116.205.172.167:38080/#/submitQnAnswer?qnId=${this.releaseForm.qnId}`
                        this.releaseForm = {...this.evaluationItem, ...this.releaseForm}
                        const {evaluatorsHandle, ...rest} = this.releaseForm
                        for (let i = 0; i < evaluatorsHandle.length; i++) {
                            if(isEmail(evaluatorsHandle[i])) {
                                this.releaseForm.evaluators[i] = { mail: evaluatorsHandle[i] }
                            }else if(isMobile(evaluatorsHandle[i])) {
                                this.releaseForm.evaluators[i] = { mobilePhone: evaluatorsHandle[i] }
                            }else if(getObjType(evaluatorsHandle[i]) === 'object') {
                                this.releaseForm.evaluators[i] = { 
                                    evaluatorId: evaluatorsHandle[i].userId,
                                    // mail: evaluatorsHandle[i].mail,
                                    // mobilePhone: evaluatorsHandle[i].phone
                                }
                            }else {
                                this.$message.error(`${evaluatorsHandle[i]}${this.$t('findStart.既不是邮箱也不是手机号')}`)
                                done()
                                return
                            }
                        }
                        this.releaseAssessQuestionnaire(rest)
                        done()
                    } else {
                        return false
                    }
                })
            },
            // 启动评估
            releaseAssessQuestionnaire(val) {
                releaseAssessQuestionnaire(val).then(res => {
                    if(res.data.status == 200) {
                        this.initReleaseForm()
                        this.$message.success(res.data.message)
                        this.$emit('closeAssessmentDialog')
                    }else {
                        this.$message.error(res.data.message)
                    }
                })
            },
      
    }
}
</script>