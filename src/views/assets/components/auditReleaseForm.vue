<template>
    <div>
     <el-form
       ref="ruleFormRef"
       label-width="220px"
       label-suffix=" :"
       :rules="rules"
       :model="releaseForm"
     >
       
       <el-form-item :label="$t('evaluationRecord.问卷')" prop="qnId">
         <el-select  @change="qnChange" v-model="releaseForm.qnId" :placeholder="`${$t('crudCommon.请选择')}${$t('evaluationRecord.问卷')}`" clearable>
           <el-option v-for="item in qnOptions" :key="item.id" :label="item.qnName" :value="item.id" />
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
       <el-form-item v-if="releaseForm.auditType === 1" :label="$t('evaluationRecord.章节审核人')" prop="chapterAuditors">
         <el-cascader 
           :placeholder="`${$t('crudCommon.请选择')}${$t('evaluationRecord.章节审核人')}`"
           v-model="releaseForm.chapterAuditors"
           @visible-change="getChapterByQnId" 
           :options="options" 
           :props="{ multiple: true }" 
           clearable />
       </el-form-item>
 
       <el-form-item :label="$t('evaluationRecord.最终审核人')" prop="superAuditorIds">
         <el-select v-model="releaseForm.superAuditorIds" :placeholder="`${$t('crudCommon.请选择')}${$t('evaluationRecord.最终审核人')}`" clearable multiple>
           <el-option v-for="item in userList" :key="item.userId" :label="item.nickName" :value="item.userId" />
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
     startForAssets,
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
                 qnId: [{ required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('evaluationRecord.问卷')}` }],
                 superAuditorIds: [{ required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('evaluationRecord.最终审核人')}` }],
                 time: [{ required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('evaluationRecord.有效时间')}` }],
                 chapterAuditors: [{ required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('evaluationRecord.章节审核人')}` }],
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
                     const {  time, chapterAuditors, ...other } = this.releaseForm
                     const [startTime, endTime] = time;
 
                     const data =  {
                         endTime,
                         startTime,
                         ...other,
                         ...this.evaluationItem,
                         prefabricates: this.prefabricates,
                       
                         chapterAuditors: this.releaseForm.auditType === 1 ? chapterAuditors.map((item) => {
                             const [chapterId, userId] = item;
                             return { userId, chapterId, sign: 1  };
                         }) : chapterAuditors,
                     }
 
                     startForAssets(data).then(res => {
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
 