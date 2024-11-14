<template>
    <div class="evaluation">
        <el-form ref="relationshipFormRef" :model="relationshipForm" label-width="120px">
            <el-form-item label="业务活动名称：">
                <el-input v-model="relationshipForm.name" placeholder="请输入业务活动名称" />
            </el-form-item>
            <el-form-item label="业务活动描述：">
                <el-input v-model="relationshipForm.description" type="textarea" :rows="2" placeholder="请输入业务活动描述" />
            </el-form-item>
            <el-button type="primary" icon="el-icon-plus" circle @click="handleAddQuestion"></el-button>
            <relation-list v-model="relationshipForm.transferRelevanceList" :assetsList="assetsList" />
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
                    id: 1,
                    projectId: '',
                    dataActivityType: '',
                    dataScale: '',
                    dataActivityDescription: '',
                    transferRelevanceList: []
                },
            ]
        },
        assetsList: [],
      }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.getAllAssetsProject()
        },
        getData() {
            return this.relationshipForm
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
            this.relationshipForm.transferRelevanceList.push({
                id: Math.random()
            })
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