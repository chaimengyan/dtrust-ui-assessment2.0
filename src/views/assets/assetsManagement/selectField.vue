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
                    <template v-for="item in checkedDataSubjectObjList">
                        <el-menu-item :index="item.mainBodyId.toString()" :key="item.mainBodyId">
                            {{item.mainBodyName}}
                        </el-menu-item>
                    </template>
                </el-menu>
            </el-aside>
            <el-container>
                <!-- 数据分类 -->
                <el-header class="dataClass">
                    <!-- <el-checkbox-group v-model="checkedDataClass" size="medium" @change="handleDataClassCheckedChange">
                        <el-checkbox-button
                            v-for="item in dataClassList"
                            :label="item.typeId"
                            :key="item.typeId">
                            {{item.typeName}}
                        </el-checkbox-button>
                    </el-checkbox-group> -->
                    <CheckTag 
                        :data="dataClassList"
                        :defaultProp="defaultProp"
                        v-model="checkedDataClass"
                        @change="handleDataClassCheckedChange"
                    />
                </el-header>
                <el-main class="field">
                    <!-- 字段类别 -->
                    <el-aside class="category" width="200px">
                        <CheckBox
                            ref="checkCBox"
                            :disabledKeys="disabled ? disabledSelectAllKeys : null"
                            :echoCheckedList="checkedCategoryList"
                            :dataList="categoryList"
                            :parentName="$t('assetsManagement.全选')"
                            itemId="categoryId"
                            itemName="categoryName"
                            @handleCheckedChange="handleCategoryCheckedChange"
                        />
                    </el-aside>
                        <!-- 字段主数据 -->
                            <div class="fieldList" >
                                <template v-for="item in checkedCategoryListAll">
                                    <CheckBox
                                        ref="checkBox"
                                        :disabledKeys="disabled ? disabledSelectKeys[item.categoryId] : null"
                                        :echoCheckedList="checkedFieldList[item.categoryId]"
                                        :echoCheckedListAll="checkedFieldListAll[item.categoryId]"
                                        :dataList="fieldList[item.categoryId]"
                                        :parentName="item.categoryName"
                                        itemId="attributesId"
                                        itemName="attributesName"
                                        :key="item.categoryId"
                                        @handleCheckedChange="(...arg) => handleFieldCheckedChange(...arg, item.categoryId)"
                                    
                                />
                                </template>
                            </div>

                </el-main>
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
import CheckTag from "@/components/CheckTag"
import { deepClone } from "@/util/util";
export default {
    name: "SelectField",
    components: {
        CheckBox,
        CheckTag
    },
    props: {
        defaultActive: {
            type: String,
            default: ''
        },
        checkedDataSubjectObjList: {
            type: Array,
            default: () => []
        },
        disabledKeys: {
            type: Array,
            default: null
        },
        projectId: {
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

        //字段类别
        // 已选字段类别
        checkedCategoryList: [],
        // 全部字段类别
        categoryList: [],
        // 已选字段类别完整数据
        checkedCategoryListAll: [],

        // 数据分类
        // 已选数据分类
        checkedDataClass: [],
        // 全部数据分类
        dataClassList: [],
        defaultProp: {
            label: 'typeName',
            value: 'typeId'
        },

        // 字段主数据
        // 已选字段ids
        checkedFieldList: {},
        // 全部字段
        fieldList: {},
        // 已选字段完整数据
        checkedFieldListAll: {},

        // 数据主体类型id
        mainBodyId: 0,
        // 数据主体类型name
        mainBodyName: '',
        disabled: false,
        disabledCheckboxKeys: false,

        disabledSelectKeys: {},
        disabledSelectAllKeys: {},

      };
    },
    watch: {
        checkedDataSubjectObjList(val) {
            console.log(this.checkedDataSubjectObjList ,'checkedDataSubjectObjList')
        },
    },
    created() {
        this.getCategoryList()
        this.getTypeList()
    },
    methods: {
        //  获取选中的全部数据(传递给父组件)
        getCheckedDataSubjectObjList() {
            return this.checkedDataSubjectObjList
        },
        // 选择数据主体类型
        handleChecked(index) {
            this.mainBodyId = index*1
            this.mainBodyName = this.checkedDataSubjectObjList.find(item => item.mainBodyId === this.mainBodyId).mainBodyName
            this.checkedDataSubjectObjList.length !== 0 && this.checkedDataSubjectObjList.forEach((item,index) => {
                if(item.mainBodyId === this.mainBodyId) {
                    this.checkedCategoryList = item.checkedCategoryList || []
                    this.checkedCategoryListAll = item.checkedCategoryListAll || []

                    this.disabled = this.disabledKeys ? this.disabledKeys.includes(item.mainBodyId) : false;

                    this.checkedDataClass = item.checkedDataClass || []

                    this.checkedFieldList = item.checkedFieldList || {}
                    this.checkedFieldListAll = item.checkedFieldListAll || {}

                    this.disabledSelectKeys = deepClone(this.checkedFieldList);
                    this.disabledSelectAllKeys = deepClone(this.checkedCategoryList);

                }
            })
            console.log(this.checkedDataSubjectObjList ,this.checkedDataClass,'切换主体类型数据')
            this.$nextTick(() => {
                if('checkCBox' in this.$refs) {
                    this.$refs.checkCBox.echoChecked()
                }
            })
            this.getAllAttributesByIds(this.checkedCategoryList, this.checkedDataClass, this.mainBodyId, '')
        },
        // 获取字段类别
        getCategoryList() {
            getCategoryList().then(res => {
                this.categoryList = res.data.data
            })
        },
        // 点击字段类别多选框事件
        handleCategoryCheckedChange(checkedList, checkedListAll) {
            this.checkedCategoryList = checkedList
            this.checkedCategoryListAll = checkedListAll
            this.checkedDataSubjectObjList.length !== 0 && this.checkedDataSubjectObjList.forEach((item,index) => {
                if(item.mainBodyId === this.mainBodyId) {
                    item.checkedCategoryList = checkedList
                    item.checkedCategoryListAll = checkedListAll
                }
            })
            this.getAllAttributesByIds(this.checkedCategoryList, this.checkedDataClass, this.mainBodyId, '')
        },

        // 获取数据分类
        getTypeList() {
            getTypeList().then(res => {
                this.dataClassList = res.data.data
            })
        },

        // 数据分类多选框点击事件
        handleDataClassCheckedChange(val) {
            console.log(val, "vallll");
            // this.checkedDataClass = val
            this.checkedDataSubjectObjList.length !== 0 && this.checkedDataSubjectObjList.forEach((item,index) => {
                if(item.mainBodyId === this.mainBodyId) {
                    item.checkedDataClass = val
                    item.dataClassList = [...this.dataClassList]
                }
            })
            this.getAllAttributesByIds(this.checkedCategoryList, this.checkedDataClass, this.mainBodyId, '')
        },

        // 获取字段
        getAllAttributesByIds(categoryIds, typeIds, mainBodyId, attributesName) {
            getAllAttributesByIds(categoryIds, typeIds, mainBodyId, attributesName).then(res => {
                this.fieldList = res.data.data.reduce((pre, cur, curIndex, arr)=> {
                    const obj = {}
                    const idKey = cur.categoryId
                    const itemValue = arr.filter(item => item.categoryId === idKey)
                    obj[idKey] = itemValue
                    return {...pre, ...obj}
                }, {})
                this.$nextTick(() => {
                    if('checkBox' in this.$refs) {
                        this.$refs.checkBox.forEach(item => {
                            item.echoChecked()
                        })
                    }
                
                })
            })
        },

        // 点击字段多选框事件
        handleFieldCheckedChange(checkedList, checkedListAll, id) {
            
            checkedListAll.forEach((item,index) => {
                item.mainBodyId = this.mainBodyId
                item.mainBodyName = this.mainBodyName
            })

            this.checkedFieldList[id] = checkedList
            this.checkedFieldListAll[id] = checkedListAll

            this.checkedDataSubjectObjList.length !== 0 && this.checkedDataSubjectObjList.forEach((item,index) => {
                if(item.mainBodyId === this.mainBodyId) {
                    if(!('checkedFieldList' in item)) {
                        item.checkedFieldList = {}
                    }
                    if(!('checkedFieldListAll' in item)) {
                        item.checkedFieldListAll = {}
                    }
                    item.checkedFieldList[id] = checkedList
                    item.checkedFieldListAll[id] = checkedListAll
                }
            })
            console.log(this.checkedFieldListAll, this.mainBodyId, '多选框数据处理')
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
    .dataClass {
        border-left: 1px solid gainsboro;
        border-bottom: 1px solid gainsboro;
        background-color: #eaf4fd;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px !important;
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