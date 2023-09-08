<template>
    <div>
        <el-form 
            ref="optionsForm"
            :disabled="viewStatus === 'view'"
            :model="optionsForm"
            label-position="left"
            class="form"
            size="mini"
            >
            <div class="form-content">
                <!-- 多选或单选 -->
                <div v-if="actType === 0 || actType === 1">
                    <el-form-item
                        :label="`${$t('dataProcessingActivities.选项')}${index < 9 ? '0'+(index+1) : index+1}:`"
                        v-for="(item,index) in optionsForm.answers"
                        :key="index"
                        :prop="'answers['+index+'].label'"
                        :rules="answersRules.label">
                        <el-input v-model="item.label" />
                        <el-form-item class="spacing" v-show="optionsForm.answers.length > 2">
                            <el-link type="primary" :disabled="viewStatus === 'view'" icon="el-icon-delete" @click="delAnswer(index)"></el-link>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item>
                        <el-link type="primary" :disabled="viewStatus === 'view'" icon="el-icon-plus" @click="addAnswer">{{$t('dataProcessingActivities.点击添加选项')}}</el-link>
                    </el-form-item>
                </div>

                <!-- 文本框 -->
                <div v-if="actType === 2">
                    <el-input
                        type="textarea"
                        :rows="3"
                        v-model="textarea">
                    </el-input>
                </div>

                <!-- 日期 -->
                <div v-if="actType === 3">
                    <el-date-picker
                        v-model="datePicker"
                        type="date">
                    </el-date-picker>
                </div>
            </div>
        </el-form>
    </div>
</template>
<script>
import {
  
} from "@/api/assets/dataProcessingActivities";
import {deepClone} from '@/util/util'

export default {
    name: "ActOptions",
    props: {
        viewStatus: {
            type: String,
            default: 'add'
        },
        echoOptionsForm: {
            type: Object,
            default: () => {}
        },
        actType: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            textarea: '',
            datePicker: '',
            optionsForm: {},
            answersRules: {
                label: [{ required: true, message: `${this.$t('crudCommon.请输入')}${this.$t('dataProcessingActivities.选项')}`, trigger: 'blur' }]
            },
        };
    },
    watch: {
     
    },
    created() {
        this.optionsForm = this.initOptionsForm()
    },
    methods: {
        initOptionsForm() {
            return {
                        answers: [//答案数组
                            {
                                label: '',
                                value: 1,//答案的值
                            },{
                                label: '',
                                value: 2,//答案的值
                            },
                        ]
                    } 
        },
        // 回显
        echoEvent() {
            this.optionsForm = deepClone(this.echoOptionsForm)
            console.log(this.echoOptionsForm, 'huixian')
        },
        // 向父组件传值
        getOptionsForm() {
            let optionsForm
             this.$refs['optionsForm'].validate((valid) => {
                if (valid) {
                    optionsForm = this.actType === 2 ? this.initOptionsForm() : this.optionsForm
                }else {
                    optionsForm = false
                    return false;
                }
            })
            return optionsForm
        },
       
        // 添加答案
        addAnswer() {
            const i = this.optionsForm.answers.length - 1
            this.optionsForm.answers.push({
                label: '',
                value: this.optionsForm.answers[i].value + 1,
            })
            console.log(this.optionsForm.answers, '添加')
        },

        // 删除答案
        delAnswer(delIndex) {
            this.optionsForm.answers.splice(delIndex,1)
            console.log(this.optionsForm.answers, '删除')

        },

      
    }
}
</script>
<style lang="scss" scoped >

.spacing {
  margin: 12px 6px;
}
.form{
  padding: 10px;
  background-color: #f5f2f2;
  .base-flex{
    display: flex;
    align-items: center;
  }
  .form-content{
    padding-left: 40px;
  }
  .form-row{
    @extend .base-flex;
  }
  ::v-deep .el-form-item{
    @extend .base-flex;
    // margin-bottom: 16px;
  }
  ::v-deep .el-form-item__label{
    word-break: keep-all;
  }
  ::v-deep .el-form-item__content{
    @extend .base-flex;
    width: 80%;
  }
}

</style>