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
import {isNumber, uniqueId} from 'lodash'
import {getChildrenById} from "@/util/util";
import {nextTick} from "vue";
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
            return this.checkedMain && this.checkedMain.length ? this.checkedMain[0].mainBodyId : ''
        },
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
            nextTick(() => {
                this.buildRenderList()
                this.buildEchoFields()
            })
            // this.getDefaultAttrs()
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
        getEchoAttr(item) {
            for (let i = 0; i < this.echo.length; i++) {

                for (let j = 0; j < this.echo[i].attributes.length; j++) {
                    const attr = this.echo[i].attributes[j]
                    if (attr._id === item._id) {
                        return attr;
                    }
                }
            }
        },
        getCheckedList() {
            return [...this.checkAllFields]
        },
        getRenderList() {
            return [...this.renderList]
        },
        getAllAttrs() {
            const result = []
            this.renderList.forEach(main => {
                main.list.forEach(cate => {
                    cate.list.forEach(item => {
                        const echoItem = this.getEchoAttr(item)
                        const newItem = echoItem ? echoItem : item
                        newItem.categoryName = cate.label;
                        newItem.categoryId = cate._id;
                        newItem.mainBodyId = main._id
                        newItem.mainBodyName = main.name
                        newItem.sourceName = item.sourceName || newItem.sourceName || ''
                        newItem.dataSubjectsVolume = item.dataSubjectsVolume || newItem.dataSubjectsVolume || 0
                        newItem._id = item._id
                        result.push(newItem)
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

        async getDefaultAttrs(main) {
            // this.checkAllFields.forEach(async main => {
                for (let i = 0; i < main.checked.length; i++) {
                    const categoryChecked = main.checked[i].checked
                    await this.getAllAttributesByIds(main.checked[i]._id, this.activeDataClass, main._id, categoryChecked, false)
                    this.setValue()
                }
            // })
        },

        // 构建多选框显示结构数据
        buildRenderList() {
            this.renderList = this.checkedMain.map((item) => {
                const is = this.renderList.find(c => c._id === item.mainBodyId)
                if (is) return is;
                return {
                    _id: item.mainBodyId,
                    name: item.mainBodyName,
                    list: this.categoryList.map(c => {
                        const _id = `${item.mainBodyId}.${c.categoryId}`
                        return {...c, _id, value: _id}
                    })
                }
            })
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
                const is = this.checkAllFields.find(item => item._id === main.mainBodyId)
                if (is) return is;

                const checked = this.echo.find(item => item.mainBodyId === main.mainBodyId)
                const _id = main.mainBodyId
                const list = checked ? this.buildCheckboxList(checked.categoryList, checked.attributes, _id) : []

                const data = {
                    _id,
                    disabled: !this.isAssets,
                    checked: list
                }

                this.getDefaultAttrs(data)
                return data
            })
        },
        buildCheckboxList(categoryList, attributes, mainId){
            return categoryList.map((item) => {
                const attrs = attributes.filter(attr => attr.categoryId === item.categoryId);
                const attrIds = attrs.map((a) => {
                    return { _id: `${mainId}.${item.categoryId}.${a.attributesId}`, disabled: !this.isAssets, checked: [] };
                })
                return { _id: `${mainId}.${item.categoryId}`, disabled: !this.isAssets, checked: attrIds }
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


        // 获取字段
        getAllAttributesByIds(categoryIds, typeIds, mainBodyId, checked, isCheck = true) {
            const itemList = getChildrenById(this.renderList, categoryIds, 'list')
            const id = categoryIds.split('.').at(-1)
            const mainId = mainBodyId.split('.').at(-1)
            return getAllAttributesByIds(id, typeIds, mainId, '').then(res => {
                const attrs = res.data.data || [];
                if (!attrs.length) {
                    return;
                }
                attrs.forEach(item => {
                    item._id = `${categoryIds}.${item.attributesId}`
                    item.label = item.attributesName
                    item.value = item._id
                    item.show = true
                    item.list = []
                })
                itemList.list = attrs
                if (isCheck) {
                    checked.push(...attrs.map(item => {
                        return {
                            _id: item._id,
                            checked: []
                        }
                    }))
                }


            })
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
            await this.getClassAttrs(checkedList, checkId)
            this.setValue()
        },

        async getClassAttrs(checkedList, checkId) {
            let [needAddIds, itemChecked, itemList] = this.deleteCheckedOrList(this.checkAllFields, checkedList, checkId)
            // 找到新增id，调用接口设置选中和节点
            if (needAddIds.length) {

                for (let i = 0; i < needAddIds.length; i++) {
                    const currentValue = needAddIds[i]
                    const item = itemList.list.find(item => (item._id === currentValue) && item.show)
                    // item 为true，可以不用调接口
                    const defaultChecked = item?.list?.length ? item.list.map(c => ({ _id: c._id, checked: [] })) : []
                    const splitId = currentValue.split('.')
                    if (!itemChecked) {
                        const [p, m, c] = splitId
                        const parent = getChildrenById(this.checkAllFields, `${p}.${m}`, 'checked')
                        itemChecked = { _id: `${p}.${m}.${c}`, checked:[] }
                        parent.checked.push(itemChecked)
                    }

                    itemChecked.checked.push({ _id: currentValue, checked: defaultChecked })
                    const isAttrs = splitId.length >= 4
                    if (!item?.list?.length && !isAttrs) {
                        await this.getAllAttributesByIds(currentValue, this.activeDataClass, checkId, defaultChecked)
                    }
                }
            }
        }

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
