<template>
    <div>
        <div v-if="!findStatus" class="findAsset">
            <div class="findHeader">
                <span>{{title}}</span>
            </div>

            <div class="findContent">
                <FindAssetForm
                    v-if="findType === 1"
                    ref="findAssetForm"
                    :findStatus="findStatus"
                    @commitJob="commitJob"
                />
                <FindBusinessForm
                    v-else
                    ref="findBusinessForm"
                    :findStatus="findStatus"
                    @commitJob="commitJob"
                />
            </div>
        </div>

        <div v-else class="successTip">
            <el-result
                icon="success"
                title="成功提示" 
                subTitle="您已完成本次填写，感谢您的帮助与支持"
            />
        </div>
    </div>
</template>

<script>
import  { commitJob, getFindJobInfoById } from "@/api/assets/findAssets";
import  FindAssetForm from "@/views/assets/assetsManagement/findAssetForm";
import  FindBusinessForm from "@/views/assets/businessScenarioManagement/findBusinessForm";
export default {
    name: "FindAssets",
    components: {
        FindAssetForm,
        FindBusinessForm
    },
    props: {
      
    },
    data() {
        return {
            // 发现资产id
            assetsFoundId: '',
            // 发现资产标题
            title: '',
            // 发现资产填写状态 1是已完成 0是未完成
            findStatus: 0,
            //1是发现资产，2是发现业务场景
            findType: 0,
        }
    },
    created() {
        this.assetsFoundId = this.$route.query.id
        this.title = this.$route.query.jobName
        this.getFindJobInfoById(this.assetsFoundId)
        this.findType = this.$route.query.findType*1
    },
    methods: {
        // 查询资产详情
        getFindJobInfoById(id) {
            getFindJobInfoById(id).then(res => {
                this.findStatus = res.data.data.status
            })
        },
        // 提交资产
        commitJob(form, done) {
            this.$confirm('是否提交?', '提示', {
                confirmButtonText: '提交',
                cancelButtonText: '不提交',
                type: 'warning'
            }).then(() => {
                const query = this.findType === 1 ? {
                        assetsFoundId: this.assetsFoundId,
                        assetsProject: form
                    } : {
                        assetsFoundId: this.assetsFoundId,
                        assetsBusinessScene: form
                    }
                commitJob(query).then(res => {
                    if(res.data.status === 200) {
                        this.findStatus = 1
                    }
                    done() 
                })
                .catch(() => {
                    done() 
                })
            })  
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消提交'
                });
                done() 
            });
        },
        
    }
}
</script>

<style lang="scss" scoped>
.findAsset {
    overflow-x: hidden;
    height: calc(100vh - 30px);
    width: 80%;
    margin: 0 auto;
    .findHeader {
        text-align: center;
        font-size: 24px;
        background-color: aliceblue;
        padding: 20px 0;
    }
    .findContent {
        background-color: aliceblue;
    }
    .submitBtn {
        text-align: end;
        margin: 40px 0;
    }
}
.findAsset::-webkit-scrollbar { width: 0 !important }
.successTip {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
</style>