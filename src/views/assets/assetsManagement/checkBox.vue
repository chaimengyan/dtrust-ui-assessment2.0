<template>
    <basic-container>
<!--        <el-checkbox :indeterminate="isIndeterminate" v-model="isCheckAll" @input="handleCheckAllChange">{{parentName}}</el-checkbox>-->
<!--        <div style="margin: 15px 0;"></div>-->
        <el-checkbox-group class="checkbox-group" :value="checkedIdList" @input="handleCheckedChange">
            <el-checkbox
                class="checkbox-item"
                :indeterminate="isViceIndeterminate"
                style="margin: 10px 0px;"
                v-for="item in list"
                :label="item.value"
                :key="item.value"
                >
                <div>
                    {{item.label}}
                </div>

                <CheckBox
                    v-if="item.list.length"
                    v-show="item.show"
                    class="checkbox-group-child"
                    :data-checkId="item._id"
                    ref="child"
                    :parentName="item.label"
                    :check-all-fields="checkAllFields"
                    :renderList="renderList"
                    @handleCheckedChange="handleCheckedChange"
                />
            </el-checkbox>
        </el-checkbox-group>
    </basic-container>
</template>

<script>
import {getChildrenById} from "@/util/util";

export default {
    name: "CheckBox",
    props: {
        // 回显已选数据
        checkAllFields: {
            type: Array,
            default: () => []
        },
        // 回显已选完整数据
        renderList: {
            type: Array,
            default: () => []
        },
        // 父节点
        parentName: {
            type: String,
            default: '全选'
        },
    },
    data() {
      return {
        // 全选按钮样式
        isIndeterminate: false,
        // 副全选按钮样式
        isViceIndeterminate: false,
        // 是否全选
        isCheckAll: false,
        // 已选数据id
          checkedIdList: [],
        checkedList: [],
          list: [],
          checkId: ''
      };
    },
    methods: {
        setDefaultValue(checkId) {
            this.checkId = checkId;
            this.setRenderList()
        },
        setRenderList() {
            const itemList = getChildrenById(this.renderList, this.checkId, 'list')
            const itemChecked = getChildrenById(this.checkAllFields, this.checkId, 'checked')
            console.log(itemList, this.renderList, this.checkId, '=====')

            this.list = [...(itemList.list || [])]
            this.checkedList = [...(itemChecked?.checked || [])]
            this.setCheckIds()
            setTimeout(() => {
                this.$refs.child?.forEach(item => {
                    const id = item.$el.getAttribute('data-checkid')
                    item.setDefaultValue(Number(id))
                })
            })

        },
        setCheckIds() {
            this.checkedIdList = this.checkedList?.map(item => item._id) || [];
        },
        // 点击多选框事件
        handleCheckedChange(value, checkId) {
            this.$emit('handleCheckedChange', value, checkId || this.checkId)
        },
    }
}
</script>
<style lang="scss" scoped>
.checkbox-group {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;

    ::v-deep .el-checkbox__label {
        line-height: 15px;
    }

    .checkbox-item {
        display: flex;
        align-items: flex-start;
        width: 50%;
        flex-shrink: 0;

        .checkbox-group-child {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            background: #f3f2f2;

            ::v-deep .el-card {
                background: transparent !important;
            }
        }
    }
}
</style>
