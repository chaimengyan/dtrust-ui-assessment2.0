<template>
   <div>
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-suffix=" :"
      :label-position="isZH ? 'right' : 'top'"
      :rules="rules"
      :model="releaseForm"
    >
      <el-form-item :label="$t('evaluationRecord.评估名称')" prop="name">
        <el-input v-model="releaseForm.name" :placeholder="`${$t('crudCommon.请输入')}${$t('evaluationRecord.评估名称')}`" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('evaluationRecord.问卷')" prop="qnId">
        <el-select  @change="qnChange" v-model="releaseForm.qnId" :placeholder="`${$t('crudCommon.请选择')}${$t('evaluationRecord.问卷')}`" clearable>
          <el-option v-for="item in qnOptions" :key="item.id" :label="item.qnName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('evaluationRecord.评估指派方式')">
        <el-switch
          v-model="releaseForm.mode"
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: #46aee7; --el-switch-off-color: #13ce66"
          :active-text="$t('evaluationRecord.按章节')"
          :inactive-text="$t('evaluationRecord.按问卷')"
          :active-value="2"
          :inactive-value="1"
          @change="changeMode('mode')"
        />
      </el-form-item>
      <el-form-item :label="$t('evaluationRecord.被评估人部门')" prop="evaluatorDeptIds">
          <el-cascader
            clearable
            v-model="releaseForm.evaluatorDeptIds"
            :options="deptList"
            :props="deptProps"
            @change="handleChangeEvaluator" />
      </el-form-item>
      <el-form-item v-if="releaseForm.mode === 2" :label="$t('evaluationRecord.被评估人')" prop="evaluators">
        <el-cascader
            :disabled="validatenull(releaseForm.qnId)"
          :placeholder="`${$t('crudCommon.请选择')}${$t('evaluationRecord.被评估人')}`"
          v-model="releaseForm.evaluators"
          @visible-change="getEvaluatorsOption"
          :options="evaluatorsOptions"
          :props="{ multiple: true }"
          clearable  >
            <template slot-scope="{ node, data }">
                <span>{{ data.label }}</span>
                <span v-if="'deptName' in data" class="dept-name"> {{ data.deptName }}</span>
            </template>
        </el-cascader>
      </el-form-item>
      <el-form-item v-else :label="$t('evaluationRecord.被评估人')" prop="userIds">
        <el-select 
            :disabled="validatenull(releaseForm.qnId)"
             v-model="releaseForm.userIds" :placeholder="`${$t('crudCommon.请选择')}${$t('evaluationRecord.被评估人')}`" clearable multiple>
            <el-option 
                v-for="item in evaluatorsUserList" 
                :key="item.userId" 
                :label="item.nickName" 
                :value="item.userId"  >
                <span >{{ item.nickName }}</span>
                <span class="dept-name">{{ item.deptName }}</span>
            </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('evaluationRecord.审核指派方式')">
        <el-switch
          v-model="releaseForm.auditType"
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: #46aee7; --el-switch-off-color: #13ce66"
          :active-text="$t('evaluationRecord.按章节')"
          :inactive-text="$t('evaluationRecord.按问卷')"
          :active-value="1"
          :inactive-value="0"
          @change="changeMode('auditType')"
        />
      </el-form-item>
      <el-form-item v-if="releaseForm.auditType === 1" :label="$t('evaluationRecord.章节审核人部门')" prop="chapterADeptIds">
          <el-cascader
            clearable
            v-model="releaseForm.chapterADeptIds"
            :options="deptList"
            :props="deptProps"
            @change="handleChangeChapterA" />
      </el-form-item>
      <el-form-item v-if="releaseForm.auditType === 1" :label="$t('evaluationRecord.章节审核人')" prop="chapterAuditors">
        <el-cascader 
            :disabled="validatenull(releaseForm.qnId)"
          :placeholder="`${$t('crudCommon.请选择')}${$t('evaluationRecord.章节审核人')}`"
          v-model="releaseForm.chapterAuditors"
          @visible-change="getChapterAOptions" 
          :options="chapterAOptions" 
          :props="{ multiple: true }" 
          clearable >
            <template slot-scope="{ node, data }">
                <span>{{ data.label }}</span>
                <span v-if="'deptName' in data" class="dept-name"> {{ data.deptName }}</span>
            </template>
        </el-cascader>
      </el-form-item>

      <el-form-item :label="$t('evaluationRecord.最终审核人部门')" prop="auditorDeptIds">
        <el-cascader
          clearable
          v-model="releaseForm.auditorDeptIds"
          :options="deptList"
          :props="deptProps"
          @change="handleChangeAuditor" />
      </el-form-item>

      <el-form-item :label="$t('evaluationRecord.最终审核人')" prop="superAuditorIds">
        <el-select 
            :disabled="validatenull(releaseForm.qnId)"
            v-model="releaseForm.superAuditorIds" 
            :placeholder="`${$t('crudCommon.请选择')}${$t('evaluationRecord.最终审核人')}`" clearable multiple>
          <el-option v-for="item in auditorUserList" :key="item.userId" :label="item.nickName" :value="item.userId" >
                <span >{{ item.nickName }}</span>
                <span class="dept-name">{{ item.deptName }}</span>
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('evaluationRecord.最终审核方式')">
        <el-switch
          v-model="releaseForm.sign"
          class="ml-2"
          inline-prompt
          style="--el-switch-on-color: #46aee7; --el-switch-off-color: #13ce66"
          :active-text="$t('evaluationRecord.或签')"
          :inactive-text="$t('evaluationRecord.并签')"
          :active-value="0"
          :inactive-value="1"
        />
      </el-form-item>
      <el-form-item :label="$t('evaluationRecord.有效时间')" prop="time">
          <el-date-picker
              v-model="releaseForm.time"
              type="datetimerange"
              :range-separator="$t('evaluationRecord.至')"
              :start-placeholder="$t('evaluationRecord.开始日期')"
              :end-placeholder="$t('evaluationRecord.结束日期')"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
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
import {getDeptTree, getUserListByDeptIdsApi} from "@/api/admin/menu"
import LogicEvaluation from "@/views/assets/components/logicEvaluation";
import {mapGetters} from "vuex";
import { validatenull } from "@/util/validate";
import { getStore } from '@/util/store'

const isZH = getStore({ name: 'language' }) === 'zh-cn'
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
            rules: {
                name: [{ required: true, message: `${this.$t('crudCommon.请输入')}${this.$t('evaluationRecord.评估名称')}` }],
                qnId: [{ required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('evaluationRecord.问卷')}` }],
                userIds: [{ required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('evaluationRecord.被评估人')}` }],
                superAuditorIds: [{ required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('evaluationRecord.最终审核人')}` }],
                time: [{ required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('evaluationRecord.有效时间')}` }],
                evaluators: [{ required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('evaluationRecord.被评估人')}` }],
                chapterAuditors: [{ required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('evaluationRecord.章节审核人')}` }],
            },
            pickerOptions: {
            // 禁用选择今日及其之前的日期
              disabledDate(time) {
                return time.getTime() < Date.now() - 8.64e7; // 8.64e7 毫秒数代表一天
              },
            },
            deptProps: {
                label: 'name',
                value: 'id',
                multiple: true,
                checkStrictly: true,
                emitPath: false,
            },
            deptList: [],
            evaluatorsUserList: [],
            auditorUserList: [],
            chapterAUserList: [],
            evaluatorsOptions: [],
            chapterAOptions: [],
            isZH,
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
        this.getParentsDept()
    },
    methods: {
        initReleaseForm() {
            this.releaseForm = {
                // 评估名称
                name: '',
                // 所选问卷
                qnId: '',
                // 被评估人
                userIds: [this.userInfo.userId],
                // 最终审核人
                superAuditorIds: [],
                // 问卷截止时间
                time: '',
                // 被评估人
                evaluators: [],
                prefabricates: [],
                chapterAuditors: [],
                evaluatorDeptIds: [],
                chapterADeptIds: [],
                auditorDeptIds: [],
            }
        },
        // 获取所有部门
        getParentsDept() {
            getDeptTree().then(res => {
                this.deptList = res.data.data
            })
        },
        handleChangeEvaluator(val) {
            if(validatenull(this.releaseForm.evaluatorDeptIds)){
                this.releaseForm.evaluatorsUserList = [...this.userList]
            }else {
                this.getUserListByDeptIds(this.releaseForm.evaluatorDeptIds)
            }
        },
         // 根据部门id查询被评估人
         getUserListByDeptIds(deptIds) {
            getUserListByDeptIdsApi(deptIds).then(res => {
                this.evaluatorsUserList = res.data.data
                if(this.releaseForm.mode === 2) {
                    this.releaseForm.evaluators = []
                }else {
                    this.releaseForm.userIds = this.releaseForm.userIds.filter(u=>{
                    return this.evaluatorsUserList.find(x=>x.userId === u)
                })
                }
            
            })
        },
        handleChangeAuditor(val) {
            if(validatenull(this.releaseForm.auditorDeptIds)){
                this.auditorUserList = [...this.userList]
            }else {
                this.getUserListByDeptIdAuditor(this.releaseForm.auditorDeptIds)
            }
        },
        // 根据部门id查询最终审核人
        getUserListByDeptIdAuditor(deptIds) {
            getUserListByDeptIdsApi(deptIds).then(res => {
                this.auditorUserList = res.data.data
                this.releaseForm.superAuditorIds = this.releaseForm.superAuditorIds.filter(u=>{
                    return this.auditorUserList.find(x=>x.userId === u)
                })
            })
        },
        handleChangeChapterA(val) {
            if(validatenull(this.releaseForm.chapterADeptIds)){
                this.chapterAUserList = [...this.userList]
            }else {
                this.getUserListByDeptIdChapterA(this.releaseForm.chapterADeptIds)
            }
        },

        // 根据部门id查询章节审核人
        getUserListByDeptIdChapterA(deptIds) {
            getUserListByDeptIdsApi(deptIds).then(res => {
                this.chapterAUserList.value = res.data.data
                this.releaseForm.chapterAuditors = []
            })
        },
        // 获取全部用户
        getUserList() {
            getUserList().then(res => {
                this.userList = res.data.data
                this.chapterAUserList = [...this.userList]
                this.auditorUserList = [...this.userList]
                this.evaluatorsUserList = [...this.userList]
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
                this.getChapterByQnId()
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
        getEvaluatorsOption() {
            const map = this.evaluatorsUserList.map(item => ({ label: item.nickName, value: item.userId, deptName: item.deptName }))
            this.evaluatorsOptions = this.chapterOptions.map((item) =>{
                return {
                    label: item.title,
                    value: item.id,
                    children: map,
                }
            });
        },

        getChapterAOptions() {
            const map = this.chapterAUserList.map(item => ({ label: item.nickName, value: item.userId, deptName: item.deptName }))
            this.chapterAOptions = this.chapterOptions.map((item) =>{
                return {
                    label: item.title,
                    value: item.id,
                    children: map,
                }
            });
        },

        getChapterByQnId() {
            getChapterByQnIdApi(this.releaseForm.qnId|| '').then(res => {
                this.chapterOptions = res.data.data
                this.getEvaluatorsOption()
                this.getChapterAOptions()
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
<style lang="scss" scoped>
.dept-name {
  font-size: 12px;
  color: darkgray;
  margin-left: 10px;
}
</style>
