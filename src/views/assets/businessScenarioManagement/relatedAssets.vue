<template>
    <basic-container v-loading="loading" class="relation-container">
        <el-row :gutter="20">
            <el-button icon="el-icon-plus" round style="margin: 10px;" @click="addVirtualAssets('add',{})">新增虚拟资产</el-button>

            <el-checkbox-group v-model="checkedDataSubjectList" @change="handleCheckedChange">
                <el-col :span="6" v-for="item in dataSubjectList" :key="item.projectId">
                    <div class="grid-content bg-purple">
                        <el-checkbox :label="item.projectId">
                            {{item.projectName}}
                        </el-checkbox>
                        <div v-if="item.sceneId" class="action-btn-group">
                            <el-button size="mini" type="text" icon="el-icon-edit" @click="addVirtualAssets('edit', item)"></el-button>
                            <el-button size="mini" style="color:red;" type="text" icon="el-icon-delete" @click="deleteBtn(item)"></el-button>
                        </div>
                    </div>
                </el-col>
            </el-checkbox-group>
        </el-row>
        <el-dialog
            width="55%"
            v-if="assessmentDialog"
            :close-on-click-modal="false"
            :visible.sync="assessmentDialog"
            append-to-body
            :fullscreen="isFullscreen">
            <div class="dialog-header" slot="title">
                <span class="dialog-header-title">{{virtualAssetType === 'add' ? $t('dataProcessingActivities.新增'):$t('crudCommon.编辑')}}</span>
                <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
                    <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
                </div>
            </div>
            <FindAssetForm
                ref="findAssetForm"
                :findStatus="0"
                :isVirtualAssets="true"
                :assetInfo="assetInfo"
                @commitJob="commitJob"
            />
        </el-dialog>
    </basic-container>
</template>
<script>
import {
    addObj,
    delVirtualAssetObj,
    putObj,
    getAllAssetsProject,
    getProjectAttributesListByProjectId
} from "@/api/assets/assetsManagement";
import  FindAssetForm from "@/views/assets/assetsManagement/findAssetForm";

export default {
    name: "RelatedAssets",
    inject: ['echoCheckedDataSubjectList'],
    components: {
        FindAssetForm
    },
    computed: {
        echo() {
            return this.echoCheckedDataSubjectList()
        }
    },
    props: {
        projectId: {
            type: Number,
            default: 0
        },
        sceneId: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            // 数据主体列表
            dataSubjectList: [],
            // 已选数据主体类型id
            checkedDataSubjectList: [],
            checkedDataSubjectOptions: [],

            allData: {},
            loading: false,
            assessmentDialog: false,
            isFullscreen: false,
            virtualAssetType: '',
            assetInfo: {},
        };
    },
    created() {
        this.getMainBodList()
    },
    methods: {
        addVirtualAssets(type, row) {
            window.boxType = type
            this.assetInfo = row
            this.virtualAssetType = type
            this.assessmentDialog = true
        },
        commitJob(form, done) {
            form.sceneId = this.sceneId
            const Api = this.virtualAssetType === 'add' ? addObj : putObj
            Api(form).then(res => {
                this.$message.success(res.data.message)
                this.assessmentDialog = false
                this.getMainBodList()
                done()
            }).catch(() => {
                done()
            })
        },
        deleteBtn(row) {
            this.$confirm(this.$t('crudCommon.是否删除本条数据'), this.$t('crudCommon.提示'), {
                confirmButtonText: this.$t('crudCommon.删除'),
                cancelButtonText: this.$t('crudCommon.不删除'),
                type: "warning",
            })
            .then(() => {
                delVirtualAssetObj(row.projectId).then((res) => {
                    if (res.data.status === 200) {
                        this.$message.success(res.data.message);
                        this.getMainBodList()
                    } else {
                        this.$message.error(res.data.message);
                    }
                });
            })
        },
        async setDefaultValue() {
            if (this.echo.length) {
                this.checkedDataSubjectList = this.echo.map(item => item.projectId) || []
                this.handleCheckedChange(this.checkedDataSubjectList)
            }
        },
        getMainBodList() {
            getAllAssetsProject(this.sceneId).then(res => {
                this.dataSubjectList = res.data.data
                this.setDefaultValue()
            })
        },
        // 选择数据主体事件
        handleCheckedChange(val) {
            // const keys = Object.keys(this.allData).filter(key => !val.includes(key))
            // keys.forEach(k => {
            //     this.allData[k] = undefined
            // })
            this.loading = true
            this.checkedDataSubjectOptions = this.dataSubjectList.filter(item => val.includes(item.projectId))
            // 拉取渲染列表
            // const filters = this.checkedDataSubjectOptions.filter(item => !this.allData[item.projectId])
            const all = this.checkedDataSubjectOptions.map(item => {
                return getProjectAttributesListByProjectId({projectId:item.projectId,sceneId: this.sceneId }).then(res => {
                    console.log(res.data.data,'res.data.data');
                    const dataSubjectList = res.data.data.map(main => {
                        // 初始化id
                        main.attributes.forEach(a => {
                            a._id = `${item.projectId}.${main.mainBodyId}.${a.categoryId}.${a.attributesId}`
                        })// 初始化id
                        main.categoryList.forEach(a => {
                            a._id = `${item.projectId}.${main.mainBodyId}.${a.categoryId}`
                        })
                        return {
                            ...main,
                            mainBodyId: `${item.projectId}.${main.mainBodyId}`
                        }
                    })
                    this.allData[item.projectId] = {
                        projectId: item.projectId,
                        projectName: item.projectName,
                        dataSubjectList
                    }
                })
            })
            Promise.all(all).then(() => {
                const data = Object.keys(this.allData).filter(k => val.includes(Number(k))).map(k => this.allData[k])
                this.$emit('change', data)
            }).finally(() => {
                this.loading = false
            })
        },
    }
}
</script>
<style lang="scss" scoped>
.relation-container {
    .el-checkbox {
        display: flex;
        align-items: center;
        width: 100%;
        ::v-deep .el-checkbox__input {
            margin-left: 12px;
        }
        ::v-deep .el-checkbox__label {
            flex: 1;
            width: 0;
            white-space: normal;
        }
    }
}
.el-row {
    margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}
.el-col {
    border-radius: 4px;
}
.bg-purple-dark {
    background: #99a9bf;
}
.bg-purple {
    background: #f5f9fe;
}
.bg-purple-light {
    background: #e5e9f2;
}
.grid-content {
    position: relative;
    word-wrap: break-word;
    border-radius: 4px;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;

    .action-btn-group {
        position: absolute;
        right: 0;
        top: 0;
        >span {
            font-size: 14px !important;
        }
    }
}
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
