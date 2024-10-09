<template>
   <div>
    <el-form
      ref="ruleFormRef"
      label-width="140px"
      label-suffix=" :"
      :rules="rules"
      :model="releaseForm"
    >
      <el-form-item label="评估名称" prop="name">
        <el-input v-model="releaseForm.name" placeholder="请填写评估名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="问卷" prop="qnId">
        <el-select  @change="qnChange" v-model="releaseForm.qnId" placeholder="请选择问卷" clearable>
          <el-option v-for="item in qnOptions" :key="item.id" :label="item.qnName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="评估指派方式">
        <el-switch
          v-model="releaseForm.mode"
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: #46aee7; --el-switch-off-color: #13ce66"
          active-text="按章节"
          inactive-text="按问卷"
          :active-value="2"
          :inactive-value="1"
          @change="changeMode('mode')"
        />
      </el-form-item>
      <el-form-item v-if="releaseForm.mode === 2" label="被评估人" prop="evaluators">
        <el-cascader
          placeholder="请选择被评估人"
          v-model="releaseForm.evaluators"
          @visible-change="getChapterByQnId"
          :options="options"
          :props="{ multiple: true }"
          clearable />
      </el-form-item>
      <el-form-item v-else label="被评估人" prop="userIds">
        <el-select v-model="releaseForm.userIds" placeholder="请选择被评估人" clearable multiple>
          <el-option v-for="item in userList" :key="item.userId" :label="item.nickName" :value="item.userId" />
        </el-select>
      </el-form-item>

      <el-form-item label="审核指派方式">
        <el-switch
          v-model="releaseForm.auditType"
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: #46aee7; --el-switch-off-color: #13ce66"
          active-text="按章节"
          inactive-text="按问卷"
          :active-value="1"
          :inactive-value="0"
          @change="changeMode('auditType')"
        />
      </el-form-item>
      <el-form-item v-if="releaseForm.auditType === 1" label="章节审核人" prop="chapterAuditors">
        <el-cascader 
          placeholder="请选择章节审核人"
          v-model="releaseForm.chapterAuditors"
          @visible-change="getChapterByQnId" 
          :options="options" 
          :props="{ multiple: true }" 
          clearable />
      </el-form-item>

      <el-form-item label="最终审核人" prop="superAuditorIds">
        <el-select v-model="releaseForm.superAuditorIds" placeholder="请选择最终审核人" clearable multiple>
          <el-option v-for="item in userList" :key="item.userId" :label="item.nickName" :value="item.userId" />
        </el-select>
      </el-form-item>
      <el-form-item label="最终审核方式">
        <el-switch
          v-model="releaseForm.sign"
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: #46aee7; --el-switch-off-color: #13ce66"
          active-text="或签"
          inactive-text="并签"
          :active-value="0"
          :inactive-value="1"
        />
      </el-form-item>
      <el-form-item label="有效时间" prop="time">
          <el-date-picker
              v-model="releaseForm.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"

          />
      </el-form-item>

     <!-- <el-button v-if="evaluationList.length !== 0" @click="logicBtn">
      配置下一级评估
     </el-button> -->
    </el-form>
    <LogicEvaluation ref="logicEvaluationRef" :qnList="qnOptions" :qn-id="releaseForm.qnId" :evaluation-list="evaluationList" @success="onSuccess" />
   </div>
</template>
<script>
import {
    getQnListApi,
    getChapterByQnIdApi,
    getByQuestionnaireApi,
    startEvaluationApi,
    getUserList
} from "@/api/assets/components/releaseForm";
import LogicEvaluation from "@/views/assets/components/logicEvaluation";
import {mapGetters} from "vuex";

export default {
    name: "ReleaseForm",
    components: {
        LogicEvaluation
    },
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
            qnOptions: [],
            // 被评估人列表
            userList: [],
            chapterOptions: [],
            evaluationList: [],
            options: [],
            rules: {
                name: [{ required: true, message: "请填写评估名称" }],
                qnId: [{ required: true, message: "请选择问卷" }],
                userIds: [{ required: true, message: "请选择被评估人" }],
                superAuditorIds: [{ required: true, message: "请选择最终审核人" }],
                time: [{ required: true, message: "请选择有效时间" }],
                evaluators: [{ required: true, message: "请选择被评估人" }],
                chapterAuditors: [{ required: true, message: "请选择章节审核人" }],
            },
        };
    },
    watch: {
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    created() {
        this.initReleaseForm()
        this.getQnList(this.typeIds)
        this.getUserList()
    },
    methods: {
        initReleaseForm() {
            this.releaseForm = {
                // 评估名称
                name: '',
                // 所选问卷
                qnId: '',
                // 被评估人
                userIds: [],
                // 最终审核人
                superAuditorIds: [],
                // 问卷截止时间
                time: '',
                // 被评估人
                evaluators: [],
                prefabricates: [],
                chapterAuditors: [],
            }
        },
        // 获取全部用户
        getUserList() {
            getUserList().then(res => {
                this.userList = res.data.data
            })
        },
        // 下拉获取问卷名称列表
        getQnList(typeIds) {
            getQnListApi({categoryIds:typeIds}).then(res => {
                this.qnOptions = res.data.data.map(item => {
                    const {id, qnName} = item
                    const obj = {id, qnName}
                    return obj
                });
            });
        },
        qnChange(qnId) {
            getByQuestionnaireApi(qnId).then(res => {
                this.evaluationList = res.data.data.filter(x => x.nextQnId)
            })
        },
        changeMode(type) {
            if(type === 'mode') {
                this.releaseForm.evaluators = []
                this.releaseForm.userIds = []
            }else {
                this.releaseForm.chapterAuditors = []
            }
        },
        getChapterByQnId() {
            getChapterByQnIdApi(this.releaseForm.qnId|| '').then(res => {
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
        logicBtn() {
            this.$refs.logicEvaluationRef.setVisible(true)
        },
        onSuccess(result) {
            this.prefabricates = result
        },

        // 确定启动评估
         releaseSave () {
            this.$refs.ruleFormRef.validate((valid, done,msg) => {
                if (valid) {
                    const { evaluators, time, chapterAuditors, ...other } = this.releaseForm
                    const [startTime, endTime] = time;

                    const data =  {
                        endTime,
                        startTime,
                        ...other,
                        ...this.evaluationItem,
                        prefabricates: this.prefabricates,
                        evaluators: this.releaseForm.mode === 2 ? evaluators.map((item) => {
                            const [chapterId, userId] = item;
                            return { userId, chapterId  };
                        }) : evaluators,
                        chapterAuditors: this.releaseForm.auditType === 1 ? chapterAuditors.map((item) => {
                            const [chapterId, userId] = item;
                            return { userId, chapterId, sign: 1  };
                        }) : chapterAuditors,
                    }

                     startEvaluationApi(data).then(res => {
                        if(res.data.status == 200) {
                            this.initReleaseForm()
                            this.$message.success(res.data.message)
                            this.$emit('closeAssessmentDialog', 'success')
                        }else {
                            this.$message.error(res.data.message)
                        }
                    }).catch(() => {
                        this.$emit('closeAssessmentDialog', 'error')

                    })
                    done()

                }else {
                    this.$emit('closeAssessmentDialog', 'error')

                    return false
                }
            })
        },
    }
}
</script>
