<template>
    <basic-container>
        <el-row :gutter="20">
            <el-checkbox-group v-model="checkedDataSubjectList" @change="handleCheckedChange">
                <el-col :span="6" v-for="item in dataSubjectList" :key="item.mainBodyId">
                    <div class="grid-content bg-purple">
                        <el-checkbox :label="item.mainBodyId" :disabled="disabledKeys ? disabledKeys.includes(item.mainBodyId) : false">
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
    components: {
        
    },
    props: {
        projectId: {
            type: Number,
            default: 0
        },
        echoCheckedDataSubjectList: {
            type: Array,
            default: () => []
        },
        disabledKeys: {
            type: Array,
            default: null
        },
    },
    data() {
      return {
        // 数据主体列表
        dataSubjectList: [],
        // 已选数据主体类型id
        checkedDataSubjectList: [],
        // 已选数据主体类型对象
        checkedDataSubjectObjList: [],
      };
    },
    watch: {
    
    },
    created() {
        this.getMainBodList()
      
    },
    methods: {
        // 回显选中
        echoChecked() {
            this.checkedDataSubjectList = this.echoCheckedDataSubjectList.map(item => item.mainBodyId)
            this.handleCheckedChange(this.checkedDataSubjectList)
        },
        // 查询所有数据主体
        getMainBodList() {
            getMainBodList().then(res => {
                this.dataSubjectList = res.data.data
            })
        },
        // 选择数据主体事件
        handleCheckedChange(val) {
          this.checkedDataSubjectObjList = val.map((item,index) => {
            return this.echoCheckedDataSubjectList.find(e => (e.mainBodyId ===item)) || this.dataSubjectList.find(d => (d.mainBodyId ===item))
          })
          this.$emit('getCheckedDataSubject', this.checkedDataSubjectList, [...this.checkedDataSubjectObjList])
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