<template>
    <basic-container>
        <el-row :gutter="20">
            <el-checkbox-group v-model="checkedAssetIds" @change="handleChange">
                <el-col :span="6" v-for="item in assetsList" :key="item.projectId">
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
import {
  getAssetsProjectAttributesListByProjectId
} from "@/api/assets/assetsManagement";
export default {
    name: "RelatedAssets",
    components: {
        
    },
    props: {
        echoCheckedAssetObjList: {
            type: Array,
            default: () => []
        },
    },
    data() {
      return {
        // 资产列表
        assetsList: [],
        // 已选资产id
        checkedAssetIds: [],
        // 已选资产对象
        checkedAssetObjList: [],
      };
    },
    watch: {
      
    },
    created() {
        this.getAllAssetsProject()
       
    },
    methods: {
        // 回显选中
        echoChecked() {
            this.checkedAssetIds = this.echoCheckedAssetObjList.map(item => {
              this.getAssetsProjectAttributesListByProjectId(item.projectId)
              return item.projectId
            })
        },
        // 查询所有资产
        getAllAssetsProject() {
            getAllAssetsProject().then(res => {
                this.assetsList = res.data.data
            })
        },
        // 选择资产事件
        handleChange(val) {
          const lastId = val.length === 0 ? '' : val[val.length-1]
          this.getAssetsProjectAttributesListByProjectId(lastId)

        },
        // 处理数据后向父组件传值
        handleCheckedAssetObjList() {
          this.checkedAssetObjList = this.checkedAssetIds.map((item,index) => {
            return this.assetsList.find(d => (d.projectId ===item))
          })
          return this.checkedAssetObjList
        },

         // 根据资产id查询字段 
        getAssetsProjectAttributesListByProjectId(id) {
            if(id === '' || 'dataSubjectList' in this.assetsList.find(p => p.projectId === id)) {
              this.handleCheckedAssetObjList()
            } else {
              getAssetsProjectAttributesListByProjectId(id).then(res => {
                const a = this.handleEchoData(res.data.data, id)
                this.assetsList.forEach((item, index) => {
                    if(item.projectId === id) {
                      this.$set(item, 'dataSubjectList', a)
                    }
                })
                this.handleCheckedAssetObjList()
              })
            }
        },

        // 处理关联字段接口返回数据，用于回显关联字段组件
        handleEchoData(data, projectId) {
            data.forEach((item,index) => {
                this.echoCheckedAssetObjList.forEach(asset => {
                  if(asset.projectId === projectId) {
                    asset.dataSubjectList.forEach(e => {
                      if(e.mainBodyId === item.mainBodyId){
                        item.checkedCategoryList = e.checkedCategoryList
                        item.checkedDataClass = e.checkedDataClass
                        item.checkedFieldList = e.checkedFieldList
                        item.checkedFieldListAll = e.checkedFieldListAll

                        // 取消勾选字段后再次勾选仍回显之前的字段关联信息
                        item.attributes.forEach((f, i, arr) => {
                          e.attributes.forEach(ef => {
                            if(f.attributesId === ef.attributesId) {
                              arr[i] = ef
                            }
                          })
                        })

                      }
                    })
                  }
                })
                item.dataClassList = item.typeList

                item.mainBodyIdCp = `${item.mainBodyId.toString()}+${projectId.toString()}`
                
                if(!('fieldList' in item)) {
                    item.fieldList = {}
                }
                item.categoryList.forEach((x, j) => { // 字段回显
                    item.fieldList[x.categoryId] = item.attributes.filter(a => x.categoryId === a.categoryId)
                })
              })
            return data
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