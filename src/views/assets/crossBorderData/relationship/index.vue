<template>
    <div class="evaluation">
        <el-form ref="relationshipFormRef" :model="relationshipForm" :rules="relationshipFormRule" label-width="140px">
            <el-form-item :label="$t('businessScenarioManagement.业务活动名称')" prop="name">
                <el-input v-model="relationshipForm.name" :placeholder="`${$t('crudCommon.请输入')}${$t('businessScenarioManagement.业务活动名称')}`" />
            </el-form-item>
            <el-form-item :label="$t('businessScenarioManagement.业务活动描述')" prop="description">
                <el-input v-model="relationshipForm.description" type="textarea" :rows="2" :placeholder="`${$t('crudCommon.请输入')}${$t('businessScenarioManagement.业务活动描述')}`" />
            </el-form-item>
            <el-button type="primary" icon="el-icon-plus" circle @click="handleAddQuestion"></el-button>
            <relation-list ref="relationRef" v-model="relationshipForm.transferRelevanceList" :filterAttrs="relationshipForm.transferRelevanceList[0].transferAttributes" :assetsList="assetsList" />
        </el-form>
        
    </div>
</template>

<script>
import { getAllAssetsProject } from "@/api/assets/assetsManagement";
import RelationList from '@/views/assets/crossBorderData/relationship/relationList.vue'

export default {
    name: "relationship",
    components: { RelationList },
    props: {
        qnId: {
            type: String,
            default: '',
        },
       
    },
    data() {
      return {
        relationshipForm: {
            name: '',
            description:'',
            transferRelevanceList: [
                {
                    id: Math.random(),
                    projectId: '',
                    dataActivityType: null,
                    dataScale: '',
                    dataActivityDescription: '',
                    projectInfo: {},
                    transferAttributes: [],
                    transferRelevanceList: []
                },
            ]
        },
        assetsList: [],
        relationshipFormRule: {
            name: [{required: true, message: `${this.$t('crudCommon.请输入')}${this.$t('businessScenarioManagement.业务活动名称')}`, trigger: 'blur'}],
            description: [{required: true, message: `${this.$t('crudCommon.请输入')}${this.$t('businessScenarioManagement.业务活动描述')}`, trigger: 'blur'}],
            
        }
      }
    },
    mounted() {
        this.getAllAssetsProject()
        this.init(this.relationshipForm)
    },
    methods: {
        init(data) {
            this.relationshipForm = data
        },
        getData() {
            return new Promise((resolve, reject) => {
                this.$refs.relationshipFormRef.validate((valid) => {
                    this.$refs.relationRef.validate().then(() => {
                        if (valid) {
                            resolve(this.relationshipForm) 
                        } else {
                            reject(false)
                            return false;
                        }
                    }).catch(reject)
                });
            })
            
        },

        addBlock(id) {
            this.$refs.questionRef[id].addBlock();
        },

        getAllAssetsProject() {
            getAllAssetsProject('').then(res => {
                this.assetsList = res.data.data
            })
        },

        handleAddQuestion() {
            const arr = [...this.relationshipForm.transferRelevanceList]
            arr.push({
                id: Math.random(),
                projectId: '',
                dataActivityType: null,
                dataScale: '',
                dataActivityDescription: '',
                transferRelevanceList: [],
                projectInfo: {},
                transferAttributes: [],
            })
            this.relationshipForm.transferRelevanceList = arr;
        },

        
    }
}





</script>

<style lang="scss" scoped>

.evaluation {
    // width: 100%;
    // height: 600px;
    // overflow: scroll;
    display: flex;
    flex-direction: column;
    // justify-content: flex-end;

}
</style>