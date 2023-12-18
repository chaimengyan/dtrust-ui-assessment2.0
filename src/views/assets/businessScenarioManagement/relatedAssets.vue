<template>
    <basic-container>
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
    getAllAssetsProject
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
            checkedDataSubjectOptions: []
        };
    },
    created() {
        this.getMainBodList()
    },
    methods: {
        setDefaultValue() {
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
            this.checkedDataSubjectOptions = this.dataSubjectList.filter(item => val.includes(item.projectId))
            this.$emit('change', this.checkedDataSubjectOptions)
        },
    }
}
</script>
<style lang="scss" scoped>
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
