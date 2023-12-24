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
                    <el-submenu v-for="item in menuList" :index="item.projectId.toString()" :key="item.projectId">
                        <template slot="title">
                            <div style="display: flex;justify-content: space-around;">
                                <div>
                                    {{item.projectName}}
                                </div>
                                <div>
                                    <i class="el-icon-circle-plus-outline" @click.stop="relationBtn(item)"></i>
                                </div>
                            </div>
                        </template>
                        <template v-for="i in item.dataSubjectList">
                            <el-menu-item :index="`${i.mainBodyId}`" :key="i.mainBodyId" >
                                {{i.mainBodyName}}
                            </el-menu-item>
                        </template>
                    </el-submenu>
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

        <AssetsRelationField
            ref="assetsRelationFieldRef"
            :isAssets="false"
            @saveSuccess="onAddField"
        />
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
    inject: ['echoCheckedDataSubjectList', 'checkedProjectBody'],
    computed: {
        echo() {
            return this.echoCheckedDataSubjectList()
        },
        checkedBody() {
            this.menuList = [...this.checkedProjectBody()]
            return this.checkedProjectBody()
        },
        defaultActive() {
            const [first = {}] = this.checkedBody || []
            const [main] = first.dataSubjectList || []
            return main ? main.mainBodyId.toString() : ''
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
            mainList: [],
            menuList: [],
            currentRow: null,
        };
    },
    created() {
        this.getTypeList()
    },
    methods: {
        mounted() {
            this.buildRenderList()
            this.buildEchoFields()
            console.log(this.renderList, 'ren')
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

        onAddField(data, attrs) {
            attrs.forEach(attr => {
                this.addField(attr)
            })
            this.setValue()
        },

        // 添加字段
        addField(attr, renderList = this.renderList, checkList = this.checkAllFields, name = 'mainBodyName', key = 'mainBodyId') {
            let list = []
            const cloneRenderList = [...renderList]
            const renderItem = cloneRenderList.find(item => item._id === attr[key])
            const checkItem = checkList.find(item => item._id === attr[key])
            const checked = checkItem ? checkItem.checked : []


            if (!renderItem) {
                if (name === 'mainBodyName') {
                    this.currentRow.dataSubjectList.push({
                        mainBodyId: attr[key],
                        mainBodyName: attr[name]
                    })
                }
                const projectId = this.currentRow.projectId;
                const projectName = this.currentRow.projectName;
                const addObject = name === 'label' ? {...attr, projectId, projectName } : {}
                const add = { ...addObject, _id: attr[key], label: attr[name], value: attr[key], show: true, list }
                renderList.push(add)
                if (!checkItem) {
                    checkList.push({ _id: attr[key], checked })
                }
            } else {
                list = renderItem.list;
            }
            if (name === 'label') return;

            const { name: newName, key: newKey } = this.getNextNameKey(name);
            this.addField(attr, list, checked, newName, newKey)
        },


        getNextNameKey(name) {
            switch (name) {
                case 'mainBodyName':
                    return { name: 'categoryName', key: 'categoryId' }
                case 'categoryName':
                    return { name: 'label', key: '_id' }
            }
        },

        // 打开关联字段弹窗
        relationBtn(row) {
            this.currentRow = row;
            row.relationDialogSize = '60%'
            this.$refs.assetsRelationFieldRef.relationBtn(row)
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
        // 在回显选中未构建完成时，判断分类下是否有选中的字段
        isCategoryHasChecked(_id) {

            for (let i = 0; i < this.echo.length; i++) {
                const data = this.echo[i].dataSubjectList

                for (let j = 0; j < data.length; j++) {
                    const categoryId = _id.split('.').at(-1)
                    const is = data[j].attributes.find(item => item.categoryId === Number(categoryId))
                    if (is) return true
                }
            }
        },

        // 构建多选框显示结构数据
        buildRenderList() {
            this.mainList = []
            this.checkedBody.forEach(item => {
                 this.mainList.push(...(item.dataSubjectList || []))
            })
            this.renderList = this.mainList.map((item) => {
                const is = this.renderList.find(r => r._id === item.mainBodyId)
                if (is) return is;
                const list = item.categoryList.map(c => {
                    return {
                        _id: c._id,
                        label: c.categoryName,
                        value: c._id,
                        show: this.isCategoryHasChecked(c._id),
                        list: this.filterAttrs(item.attributes, c.categoryId)
                    }
                })
                return {
                    _id: item.mainBodyId.toString(),
                    label: item.mainBodyName,
                    list
                }
            })
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
            const echoList = []
            this.echo.forEach(item => {
                echoList.push(...(item.dataSubjectList || []))
            })
            this.checkAllFields = this.mainList.map(main => {
                const is = this.checkAllFields.find(item => item._id === main.mainBodyId)
                if (is) return is;
                const checked = echoList.find(item => item.mainBodyId === main.mainBodyId)
                const _id = main.mainBodyId
                const list = checked ? this.buildCheckboxList(checked.categoryList, checked.attributes, _id) : []
                return {
                    _id,
                    checked: list
                }
            })
        },
        // 这里的mainBodyId 已经是 projectId + mainBodyId 了
        buildCheckboxList(categoryList, attributes, mainBodyId){
            return categoryList.map((item) => {
                const attrs = attributes.filter(attr => attr.categoryId === item.categoryId);
                const attrIds = attrs.map((item) => {
                    return { _id: `${mainBodyId}.${item.categoryId}.${item.attributesId}`, checked: [] };
                })
                return { _id: item._id, checked: attrIds }
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
                    const checked = item ? item.list.map(item => ({ _id: item._id, checked: [] })) : []
                    console.log(checked, item, 'checkedwdwdadas')
                    itemChecked.checked.push({ _id: currentValue, checked })
                }
            }


            this.checkAllFields = [...this.checkAllFields]
            this.renderList = [...this.renderList]
            console.log(this.renderList, 'reennnn')
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
