<template>
    <basic-container>
       <el-container class="fieldContainer">
           <!-- 数据主体类型 -->
            <el-aside class="dataSubject"  width="200px">
                <el-menu
                    class="el-menu-vertical-demo"
                    @select="handleChecked"
                    :default-active="defaultActive"
                    background-color="#dadde2"
                    text-color="#303133"
                    >
                    <template v-for="item in checkedMain">
                        <el-menu-item :index="item.mainBodyId.toString()" :key="item.mainBodyId">
                            {{item.mainBodyName}}
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-aside>
            <el-container>
                <div class="select-field-content">
                    <div>
                        <el-tag
                            v-for="item in dataClassList"
                            :key="item.typeId.toString()"
                            :type="activeDataClass.includes(item.typeId) ? 'success' : 'info'"
                            class="mx-1"
                            effect="dark"
                            @click="handleClickDataClass(item.typeId)"
                        >
                            {{ item.typeName }}
                        </el-tag>
                    </div>
                    <CheckBox ref="checkbox" :checkId="mainBodyId" :checkAllFields="checkAllFields" :renderList="renderList" @handleCheckedChange="handleCheckedChange" />
                </div>
            </el-container>
        </el-container>
    </basic-container>
</template>
<script>
import {
  getAllAttributesByIds
} from "@/api/fieldManagement/fieldMasterData";
import {
  getCategoryList
} from "@/api/fieldManagement/fieldCategory";
import {
  getTypeList
} from "@/api/fieldManagement/dataClassification";
import CheckBox from "@/views/assets/assetsManagement/checkBox";
import { uniqueId } from 'lodash'
import {getChildrenById} from "@/util/util";
export default {
    name: "SelectField",
    components: {
        CheckBox,
    },
    inject: ['echoCheckedDataSubjectList', 'checkedMainBody'],
    computed: {
        echo() {
            return this.echoCheckedDataSubjectList()
        },
        checkedMain() {
            return this.checkedMainBody()
        },
        defaultActive() {
            return this.checkedMain && this.checkedMain.length ? this.checkedMain[0].mainBodyId.toString() : ''
        },
    },
    props: {
        projectId: {
            type: Number,
            default: 0
        },
    },
    data() {
      return {
        // 全部字段类别
        categoryList: [],

        // 全部数据分类
        dataClassList: [],

        // 全部字段
        fieldList: {},
          // 选中的dataClass
        activeDataClass: [],
          // 所有选中数据结构体
        checkAllFields: [],
          // 渲染多选框数据结构体
          renderList: [],
          // 选中的主体
          mainBodyId: 0,
      };
    },
    created() {
        this.getCategoryList()
        this.getTypeList()
    },
    methods: {
        mounted() {
            this.buildRenderList()
            this.buildEchoFields()
        },
        setValue() {
            this.$nextTick(() => {
                this.$refs.checkbox.setDefaultValue(this.mainBodyId || this.defaultActive);
            })
        },
        getAttrs() {
            // 获取所有存在的attr
            const allAttrs = this.getAllAttrs();
            // 获取所有选中attr的ids
            const allCheckedIds = this.getAllCheckedIds()
            return allAttrs.filter(item => allCheckedIds.includes(item._id))
        },
        getAllAttrs() {
            const result = []
            this.renderList.forEach(main => {
                main.list.forEach(item => {
                    result.push(...item.list.map(item => ({
                        ...item,
                        mainBodyId: main._id,
                        mainBodyName: main.name,
                    })))
                })
            })
            return result;
        },
        getAllCheckedIds() {
            const result = []
            this.checkAllFields.forEach(item => {
                item.checked.forEach(item => {
                    result.push(...item.checked.map(item => item._id))
                })
            })
            return result;
        },
        // 获取数据分类
        getTypeList() {
            getTypeList().then(res => {
                this.dataClassList = res.data.data
            })
        },
        // 获取字段类别
        getCategoryList() {
            getCategoryList().then(res => {
                this.categoryList = res.data.data
                this.categoryList.forEach(item => {
                    item._id = item.categoryId
                    item.label = item.categoryName
                    item.value = item.categoryId
                    item.list = []
                    item.show = true
                })
            })
        },

        // 构建多选框显示结构数据
        buildRenderList() {
            this.renderList = this.checkedMain.map((item) => ({
                _id: item.mainBodyId.toString(),
                name: item.mainBodyName,
                list: this.categoryList.map(item => ({...item}))
            }))
        },


        // 构建多选框选中回显信息
        /**
         * {
         *     _id: 1,
         *     checked: [
         *         { _id: 2, checked: [] }
         *     ]
         * }
         *
         * {
         *     _id: 1,
         *     label: '',
         *     value: '',
         *     show: false,
         *     list: [
         *         { _id: 1. label: '', value: '', show: false, list: [] }
         *     ]
         * }
         */
        buildEchoFields() {
            this.checkAllFields = this.checkedMain.map(main => {
                const checked = this.echo.find(item => item.mainBodyId === main.mainBodyId)

                return {
                    _id: main.mainBodyId.toString(),
                    checked: checked ? this.buildCheckboxList(checked.categoryList, checked.attributes) : []
                }
            })
        },
        buildCheckboxList(categoryList, attributes){
            return categoryList.map((item) => {
                const attrs = attributes.filter(attr => attr.categoryId === item.categoryId);
                const attrIds = attrs.map((item) => {
                    return { _id: item.attributesId, checked: [] };
                })
                return { _id: item.categoryId, checked: attrIds }
            })
        },

        handleClickDataClass(typeId) {
            const index = this.activeDataClass.findIndex(v => v === typeId)
            if (index !== -1) {
                return this.activeDataClass.splice(index, 1)
            }
            this.activeDataClass.push(typeId)
        },

        // 选择数据主体类型
        handleChecked(index) {
            this.mainBodyId = index;
            this.setValue();
        },



        // 数据分类多选框点击事件
        handleDataClassCheckedChange(val) {
        },


        // 获取字段
        getAllAttributesByIds(categoryIds, typeIds, mainBodyId, checked) {
            const itemList = getChildrenById(this.renderList, categoryIds, 'list')

            return getAllAttributesByIds(categoryIds, typeIds, mainBodyId, '').then(res => {
                const attrs = res.data.data || [];
                if (!attrs.length) {
                    return;
                }
                attrs.forEach(item => {
                    item._id = uniqueId() + uniqueId()
                    item.label = item.attributesName
                    item.value = item._id
                    item.show = true
                    item.list = []
                })
                itemList.list = attrs
                checked.push(...attrs.map(item => {
                    return {
                        _id: item._id,
                        checked: []
                    }
                }))

            })
        },

        // 取消多选框时，删除选中的数据/删除节点list数据, 返回需要新增的id数组
        deleteCheckedOrList(data, checkedList, checkId) {
            const itemList = getChildrenById(this.renderList, checkId, 'list')
            const itemChecked = getChildrenById(this.checkAllFields, checkId, 'checked')

            itemList.list.forEach(item => {
                item.show = checkedList.includes(item._id);

                if (!item.show && itemChecked) {
                    const i = itemChecked.checked.findIndex(cur => cur._id === item._id)
                    if (i !== -1) {
                        itemChecked.checked.splice(i, 1)
                    }
                }
            })
            const needAddIds = checkedList.filter(_id => !itemChecked?.checked.find(item => item._id === _id))

            return [needAddIds, itemChecked, itemList]
        },

        // 点击字段多选框事件
        async handleCheckedChange(checkedList, checkId) {
            const [needAddIds, itemChecked, itemList] = this.deleteCheckedOrList(this.checkAllFields, checkedList, checkId)

            // 找到新增id，调用接口设置选中和节点
            if (needAddIds.length) {

                for (let i = 0; i < needAddIds.length; i++) {
                    const currentValue = needAddIds[i]
                    const item = itemList.list.find(item => (item._id === currentValue) && item.show)
                    // item 为true，可以不用调接口
                    const defaultChecked = item?.list?.length ? item.list.map(c => ({ _id: c._id, checked: [] })) : []
                    itemChecked.checked.push({ _id: currentValue, checked: defaultChecked })
                    if (!item?.list?.length) {
                        await this.getAllAttributesByIds(currentValue, this.activeDataClass, checkId, defaultChecked)
                    }
                }
            }


            this.checkAllFields = [...this.checkAllFields]
            this.renderList = [...this.renderList]
            this.setValue()
        },

    }
}
</script>
<style lang="scss" scoped>
::v-deep .el-menu-item.is-active {
    background-color: #ffffff !important;
}
::v-deep .el-menu-item {
    border-radius: 8px;
    text-align: center;
    margin: 5px;
}
.fieldContainer{
    border: 2px solid gainsboro;
    border-radius: 6px;
    margin-bottom: 50px;
    box-shadow: 2px 3px 12px 6px gainsboro;

    ::v-deep .el-card__body {
        padding: 0;
    }

    .select-field-content {
        flex: 1;
        width: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }

    .dataSubject {
        padding-top: 45px;
        background-color: #eaf4fd;
    }
    .category {
        width: 270px !important;
        padding-top: 10px;
        border-left: 1px solid gainsboro;
        border-right: 1px solid gainsboro;
        display: flex;
        // align-items: center;
        justify-content: center;
    }
    .field {
        display: flex;
        // border: 1px solid gainsboro;
    }
    .fieldList{
        // display: flex;
    }
}
</style>
