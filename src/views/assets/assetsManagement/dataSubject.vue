<template>
    <basic-container>
        <el-row :gutter="20">
            <el-checkbox-group v-model="checkedDataSubjectList" @change="handleCheckedChange">
                <el-col :span="6" v-for="item in dataSubjectList" :key="item.mainBodyId">
                    <div class="grid-content bg-purple">
                        <el-checkbox :label="item.mainBodyId" :disabled="disabledKeys.includes(item.mainBodyId)">
                            {{item.mainBodyName}}
                        </el-checkbox>
                    </div>
                </el-col>
            </el-checkbox-group>
        </el-row>
    </basic-container>
</template>
<script>
import {
  getMainBodList
} from "@/api/fieldManagement/dataSubjectType";
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
        },
        isAssets: {
            type: Boolean,
            default: true
        },
    },
    data() {
      return {
        // 数据主体列表
        dataSubjectList: [],
        // 已选数据主体类型id
        checkedDataSubjectList: [],
        checkedDataSubjectOptions: [],
          disabledKeys: []
      };
    },
    created() {
        this.getMainBodList()
    },
    methods: {
        setDefaultValue() {
            if (this.echo.length) {
                this.checkedDataSubjectList = this.echo.map(item => item.mainBodyId) || []
                if (!this.isAssets) {
                    this.disabledKeys = [...this.checkedDataSubjectList]
                }
                this.handleCheckedChange(this.checkedDataSubjectList)
            }
        },
        // 查询所有数据主体
        getMainBodList() {
            getMainBodList().then(res => {
                this.dataSubjectList = res.data.data.map(item => ({
                    ...item,
                    mainBodyId: `${this.projectId}.${item.mainBodyId}`
                }))
                this.setDefaultValue()
            })
        },
        // 选择数据主体事件
        handleCheckedChange(val) {
          this.checkedDataSubjectOptions = this.dataSubjectList.filter(item => val.includes(item.mainBodyId))
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
    word-wrap: break-word;
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
