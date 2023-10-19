<template>
    <div>
        <el-form ref="answersForm" :model="answersForm">
            <div v-for="item in activitiesList" :key="item.activitiesId">
                <el-form-item 
                    v-if="item.activitiesType === 'radio'" 
                    :label="`${item.activitiesName}：`" >
                    <el-radio 
                        v-for="(a, i) in item.answers"
                        :label="a.value"
                        v-model="item.echoActivitiesValue"
                        :key="i"
                       >
                        {{a.label}} 
                    </el-radio>
                </el-form-item>
                <el-form-item 
                    v-if="item.activitiesType === 'checkbox'" 
                    :label="`${item.activitiesName}：`" >
                    <el-checkbox-group v-model="item.echoActivitiesValue">
                        <el-checkbox 
                            v-for="(a, i) in item.answers" 
                            :label="a.value" 
                            :key="i">
                            {{a.label}} 
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item 
                    v-if="item.activitiesType === 'textarea'" 
                    :label="`${item.activitiesName}：`" >
                    <el-input
                        type="textarea"
                        :rows="3"
                        v-model="item.echoActivitiesValue">
                    </el-input>
                </el-form-item>
                <el-form-item 
                    v-if="item.activitiesType === 'date'" 
                    :label="`${item.activitiesName}：`" >
                    <el-date-picker
                        v-model="item.echoActivitiesValue"
                        type="date"
                        value-format="yyyy-MM-dd"
                        >
                    </el-date-picker>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>
<script>

export default {
    name: "ActAnswers",
    components: {
        
    },
    props: {
        activitiesList: {
            type: Array,
            default: () => []
        },
    },
    data() {
      return {
            radioValue: '',
            checkList: [],
            textarea: '',
            answersForm: {},
      };
    },
    watch: {
      'activitiesList': {
          handler(newVal, oldVal) {
                console.log(newVal, oldVal, '////')
          },
      }
    },
    created() {
       
    },
    methods: {
        
        changeRadio(obj, ...val) {

            console.log(obj, val, '单选')
        },
        changeBox(obj, ...val) {
            console.log(obj, val, '多选')
        }
      

    }
}
</script>
<style lang="scss" scoped>
    
</style>