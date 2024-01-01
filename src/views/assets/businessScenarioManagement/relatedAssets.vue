<template>
    <basic-container v-loading="loading" class="relation-container">
        <el-row :gutter="20">
            <el-checkbox-group v-model="checkedDataSubjectList" @change="handleCheckedChange">
                <el-col :span="6" v-for="item in dataSubjectList" :key="item.projectId">
                    <div class="grid-content bg-purple">
                        <el-checkbox :label="item.projectId">
                            {{item.projectName}}
                        </el-checkbox>
                    </div>
                </el-col>
            </el-checkbox-group>
        </el-row>
    </basic-container>
</template>
<script>
import {
    getAllAssetsProject,
    getProjectAttributesListByProjectId
} from "@/api/assets/assetsManagement";

export default {
    name: "DataSubject",
    inject: ['echoCheckedDataSubjectList'],
    computed: {
        echo() {
            return this.echoCheckedDataSubjectList()
        }
    },
    props: {
        projectId: {
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
            loading: false
        };
    },
    created() {
        this.getMainBodList()
    },
    methods: {
        async setDefaultValue() {
            if (this.echo.length) {
                this.checkedDataSubjectList = this.echo.map(item => item.projectId) || []
                this.handleCheckedChange(this.checkedDataSubjectList)
            }
        },
        getMainBodList() {
            getAllAssetsProject().then(res => {
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

                return getProjectAttributesListByProjectId(item.projectId).then(res => {
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
    border-radius: 4px;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}
</style>
