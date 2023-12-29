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
                    <template v-for="item in checkedBody">
                        <el-menu-item :index="`${item.mainBodyId}`" :key="item.mainBodyId" >
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
    getTypeList
} from "@/api/fieldManagement/dataClassification";
import CheckBox from "@/views/assets/assetsManagement/checkBox";
import AssetsRelationField from '../assetsManagement/assetsRelationField'
import {getChildrenById} from "@/util/util";

export default {
    name: "SelectField",
    components: {
        CheckBox,
        AssetsRelationField
    },
    props: {
        checkedBody: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        defaultActive() {
            const [first] = this.checkedBody || []
            const id = first ? first.mainBodyId.toString() : ''
            if (id) {
                this.$nextTick(this.setValue)
            }
            return id
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
        this.getTypeList()
    },
    methods: {
        mounted() {
            this.$nextTick(() => {
                this.buildRenderList()
                this.buildEchoFields()
            })
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
                    item.list.forEach(item => {
                        item.mainBodyId = main._id
                        item.mainBodyName = main.label
                        result.push(item)
                    })
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
        // 构建多选框显示结构数据
        buildRenderList() {
            this.renderList = this.checkedBody.map((item) => {
                const list = item.categoryList.map(c => {
                    return {
                        _id: c._id,
                        label: c.categoryName,
                        value: c._id,
                        show: true,
                        list: this.filterAttrs(item.attributes, c.categoryId)
                    }
                })
                return {
                    _id: item.mainBodyId.toString(),
                    label: item.mainBodyName,
                    list
                }
            })
            console.log(this.renderList, 'this.renderList')

        },

        filterAttrs(data, categoryId) {
            return data.filter(item => item.categoryId === categoryId).map(item => {
                return {
                    ...item,
                    _id: item._id,
                    label: item.attributesName,
                    value: item._id,
                    show: true,
                    list: [],
                }
            })
        },

        buildEchoFields() {
            this.checkAllFields = this.checkedBody.map(main => {
                const _id = main.mainBodyId.toString()
                return {
                    _id,
                    checked: []
                }
            })
        },

        handleClickDataClass(typeId) {
            const index = this.activeDataClass.findIndex(v => v === typeId)
            if (index !== -1) {
                this.activeDataClass.splice(index, 1)
            } else {
                this.activeDataClass.push(typeId)
            }
            this.filterFieldList()
            this.setValue()
        },

        filterFieldList() {
            this.renderList.forEach(item => {
                item.list.forEach(parent => {
                    if (!this.activeDataClass.length && !parent.list.length) {
                        return parent.hide = false
                    }
                    parent.hide = true;
                    parent.list.forEach(item => {
                        item.hide = this.activeDataClass.length ? !this.activeDataClass.includes(item.typeId) : false
                        if (!item.hide) {
                            parent.hide = false
                        }
                    })

                })

            })
        },

        // 选择数据主体类型
        handleChecked(index) {
            this.mainBodyId = index;
            this.setValue();
        },

        // 取消多选框时，删除选中的数据/删除节点list数据, 返回需要新增的id数组
        deleteCheckedOrList(data, checkedList, checkId) {
            const itemList = getChildrenById(this.renderList, checkId, 'list')
            const itemChecked = getChildrenById(this.checkAllFields, checkId, 'checked')

            itemList.list.forEach(item => {
                const is = checkedList.includes(item._id)
                if (is) {
                    item.show = true;
                }

                if (!is && itemChecked) {
                    const i = itemChecked.checked.findIndex(cur => cur._id === item._id)
                    if (i !== -1) {
                        itemChecked.checked.splice(i, 1)
                            if (!itemChecked.checked.length) {
                                const ids = itemChecked._id.split('.')
                                ids.splice(ids.length - 1, 1)
                                const id = ids.join('.')
                                const findItem = getChildrenById(this.checkAllFields, id, 'checked')
                                if (!findItem) return;
                                const i = findItem.checked.findIndex(item => item._id === itemChecked._id)
                                findItem.checked.splice(i, 1)
                            }
                    }
                }
            })
            const needAddIds = checkedList.filter(_id => !itemChecked?.checked.find(item => item._id === _id))

            return [needAddIds, itemChecked, itemList]
        },

        // 点击字段多选框事件
        async handleCheckedChange(checkedList, checkId) {
            let [needAddIds, itemChecked, itemList] = this.deleteCheckedOrList(this.checkAllFields, checkedList, checkId)

            // 找到新增id，调用接口设置选中和节点
            if (needAddIds.length) {
                for (let i = 0; i < needAddIds.length; i++) {
                    const currentValue = needAddIds[i]
                    const item = itemList.list.find(item => (item._id === currentValue) && item.show)
                    const checked = item ? item.list.map(item => ({ _id: item._id, checked: [] })) : []
                    if (!itemChecked) {
                        const [m, c] = currentValue.split('.')
                        const parent = getChildrenById(this.checkAllFields, m, 'checked')
                        itemChecked = { _id: `${m}.${c}`, checked:[] }
                        parent.checked.push(itemChecked)
                    }

                    itemChecked.checked.push({ _id: currentValue, checked })
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
