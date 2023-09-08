<template>
    <basic-container>
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText">
      </el-input>
      <el-tree
        class="filter-tree"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedKeys"
        :props="defaultProps"
        :filter-node-method="filterNode"
        ref="tree"
        :load="loadNode"
        lazy
        @check-change="handleCheckChange"
      />
    </basic-container>
</template>
<script>
import {
  addAttributes,
  getActivitiesDataByActivitiesId
} from "@/api/assets/dataProcessingActivities";
import {
  getAllAssetsProject,
  getAssetsProjectAttributesListByProjectId
} from "@/api/assets/assetsManagement";
import { removeArray } from "@/util/util";

export default {
    name: "RelatedAssets",
    props: {
      activitiesId: {
        type: Number,
        default: 0
      },
      isView: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        filterText: '',
        // 资产字段树勾选回显
        checkedKeys: [],
        // 接口提交数据
        fieldList: [],
        defaultProps: {
          label: "name",
          value: "id",
          disabled: this.disabledFun
        },
      };
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() {
      this.getActivitiesDataByActivitiesId(this.activitiesId)
    },
    methods: {
      loadNode(node, resolve) {
        if (node.level === 0) {
          this.getAllAssetsProject(resolve)
        } else if(node.level === 1) {
          this.getAssetsProjectAttributesListByProjectId(node.data.id, true, resolve)
        } else {
          return resolve([])
        }
      },
      disabledFun() {
        if (this.isView) {
          return true
        } else{
          return false
        }
      },
      // 根据资产id查询字段 
      getAssetsProjectAttributesListByProjectId(id, isLeaf, resolve) {
        getAssetsProjectAttributesListByProjectId(id).then(res => {
          const data = res.data.data.projectAttributesList
          .map(item => ({
              id: item.id,
              name: item.attributesName,
              leaf: isLeaf,
              activitiesId: this.activitiesId
          }));
          resolve(data)
        })
      },
      // 根据处理活动id获取处理活动关联的资产字段
      getActivitiesDataByActivitiesId(id) {
        getActivitiesDataByActivitiesId(id).then(res => {
          this.checkedKeys = res.data.data.ids
          this.fieldList = res.data.data.activitiesAttributesList
        })
      },
      // 获取全部资产
      getAllAssetsProject(resolve) {
        getAllAssetsProject().then(res => {
          const data = res.data.data
         .map(item=> ({
            id: item.projectId,
            name: item.projectName
          }))
          resolve(data)
        })
      },
      // 保存关联资产字段数据
      saveCurd() {
        if(!this.fieldList[0]) {
          this.$message.error('请选择需要关联的资产字段！')
        } else {
          addAttributes(this.fieldList).then(res => {
            if(res.data.status === 200) {
              this.$emit('saveSuccess')
              this.$message.success(res.data.message)
            }
          })
        }
      },
      // 筛选字段树节点
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      // 节点选中状态发生变化
      handleCheckChange(data, checked, indeterminate) {
        const repeat = this.fieldList.some(x => (x.projectAttributesId == data.id))
        if(data.leaf) {
          if(checked) {
            if(!repeat) {
              this.fieldList.push({activitiesId: data.activitiesId, projectAttributesId: data.id})
            }
          } else {
            removeArray(this.fieldList, 'projectAttributesId', data, 'id')
          }
        }
      },
      
    }
}
</script>