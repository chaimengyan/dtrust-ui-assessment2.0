<template>
    <basic-container>
      <el-form
            :disabled="viewStatus === 'view'"
            ref="activitiesForm"
            :model="activitiesForm"
            :rules="activitiesFormRules"
            label-width="150px">
            <el-form-item prop="activitiesCategory" :label="$t('dataProcessingActivities.处理活动类别')" >
                <el-select v-model="activitiesForm.activitiesCategory" >
                    <el-option
                        v-for="item in activitiesCategoryOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item prop="activitiesName" :label="$t('dataProcessingActivities.处理活动名称')">
                <el-input v-model="activitiesForm.activitiesName" :placeholder="placeholder"></el-input>
            </el-form-item>
            <el-form-item prop="definition" :label="$t('crudCommon.描述')">
                <el-input type="textarea" v-model="activitiesForm.definition"></el-input>
            </el-form-item>
            <el-form-item prop="activitiesType" :label="$t('dataProcessingActivities.选项类型')">
                <el-radio-group v-model="activitiesForm.activitiesType" @change="changeType">
                    <template v-for="item in activitiesTypeOptions">
                        <el-radio
                            :label="item.value"
                            :key="item.value"
                            >
                            {{item.label}}
                            </el-radio>
                    </template>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('dataProcessingActivities.选项内容')">
                <ActOptions 
                    ref="actOptions"
                    :viewStatus="viewStatus"
                    :echoOptionsForm="echoOptionsForm"
                    :actType="activitiesForm.activitiesType"
                />
            </el-form-item>

      </el-form>
    </basic-container>
</template>
<script>
import {
  
} from "@/api/assets/dataProcessingActivities";
import ActOptions from '@/views/assets/dataProcessingActivities/actOptions'
import { activitiesCategoryOptions } from "@/util/enum"
import {deepClone} from '@/util/util'
export default {
    name: "AddActivities",
    components: {
        ActOptions
    },
    props: {
        viewStatus: {
            type: String,
            default: 'add'
        },
        echoActivitiesForm: {
            type: Object,
            default: () => {}
        },
        activitiesTypeOptions: {
            type: Array,
            default: () => []
        },
    },
    data() {
      return {
        // 示例
        placeholder: `${this.$t('crudCommon.请输入')}${this.$t('dataProcessingActivities.处理活动名称')}`,
        activitiesCategoryOptions,
        activitiesForm: {
            activitiesCategory: '',
            activitiesName: '',
            definition: '',
            activitiesType: 'radio',
            activitiesJson: '',
        },
        // 回显内容
        echoOptionsForm: {},
        activitiesFormRules: {
            activitiesCategory: [
                {required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('dataProcessingActivities.处理活动类别')}`, trigger: 'change'}
            ],
            activitiesName: [
                {required: true, message: `${this.$t('crudCommon.请输入')}${this.$t('dataProcessingActivities.处理活动名称')}`, trigger: 'blur'}
            ],
            // definition: [
            //     {required: true, message: '请输入定义', trigger: 'blur'}
            // ],
            activitiesType: [
                {required: true, message: `${this.$t('crudCommon.请选择')}${this.$t('dataProcessingActivities.选项类型')}`, trigger: 'change'}
            ],
        },
        
      };
    },
    watch: {
      'activitiesForm.activitiesCategory': {
          handler() {
              this.placeholder = this.activitiesCategoryOptions.find(i => i.value === this.activitiesForm.activitiesCategory).placeholder || this.placeholder
          },
      }
    },
    created() {
        
    },
    methods: {
        // 回显
        echoEvent() {
            this.activitiesForm = deepClone(this.echoActivitiesForm)
            this.echoOptionsForm = JSON.parse(this.activitiesForm.activitiesJson)
            this.$nextTick(()=> {
                this.$refs.actOptions.echoEvent()
            })
        },
        // 向父组件传值
        getActivitiesForm() {
            let activitiesForm
            this.$refs['activitiesForm'].validate((valid) => {
                if (valid) {
                    const optionsForm = this.$refs.actOptions.getOptionsForm()
                    if(optionsForm === false) return
                    this.activitiesForm.activitiesJson = JSON.stringify(optionsForm)
                    activitiesForm = this.activitiesForm
                }else {
                    activitiesForm = false
                    return false;
                }
            })
            return activitiesForm
        },
        changeType(val) {
            console.log(val, this.activitiesForm.activitiesType, '选择类型')
        },
      
      
    }
}
</script>