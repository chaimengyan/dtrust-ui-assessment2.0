<template>
    <basic-container>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{parentName}}</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedList" @change="handleCheckedChange">
            <el-checkbox
                :indeterminate="isViceIndeterminate"
                style="margin: 10px;"
                v-for="item in dataList"
                :label="item[itemId]"
                :key="item[itemId]"
                >
                {{item[itemName]}}
            </el-checkbox>
        </el-checkbox-group>
    </basic-container>
</template>

<script>
import {deepClone} from '@/util/util'
export default {
    name: "CheckBox",
    props: {
        // 回显已选数据
        echoCheckedList: {
            type: Array,
            default: () => []
        },
        // 回显已选完整数据
        echoCheckedListAll: {
            type: Array,
            default: () => []
        },
        // 全部数据
        dataList: {
            type: Array,
            default: () => []
        },
        // 父节点
        parentName: {
            type: String,
            default: '全选'
        },
        itemId: {
            type: String,
            default: ''
        },
        itemName: {
            type: String,
            default: ''
        },
    },
    data() {
      return {
        // 全选按钮样式
        isIndeterminate: false,
        // 副全选按钮样式
        isViceIndeterminate: false,
        // 是否全选
        checkAll: false,
        // 已选数据id
        checkedList: [],
        // 已选数据全部
        checkedListAll: [],
      };
    },
    watch: {
    },
    created() {
    },
    methods: {
        // 回显选中
        echoChecked() {
            this.checkedList = deepClone(this.echoCheckedList)
            this.handleCheckedChange(this.checkedList)
        },
        // 点击全选按钮事件
        handleCheckAllChange(val) {
            this.checkedList = val ? this.dataList.map(item => (item[this.itemId])) : [];
            this.checkedListAll = val ? this.dataList : [];
            this.isIndeterminate = false;
            this.$emit('handleCheckedChange', this.checkedList, this.checkedListAll)
        },

        // 点击多选框事件
        handleCheckedChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.dataList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataList.length;

            if(this.echoCheckedListAll.length !== 0) {
                this.checkedListAll = value.map((item,index) => {
                    return this.echoCheckedListAll.find(e => (e[this.itemId] ===item)) || this.dataList.find(d => (d[this.itemId] ===item))
                })
            } else {
                this.checkedListAll = this.dataList.filter(item => (this.checkedList.includes(item[this.itemId])))
            }
            
            this.$emit('handleCheckedChange', this.checkedList, this.checkedListAll)
        },
    }
}
</script>
<style lang="scss" scoped>

</style>