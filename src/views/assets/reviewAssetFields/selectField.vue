<template>
    <basic-container>
       <el-container class="fieldContainer">
           <!-- 数据主体类型 -->
            <el-aside class="dataSubject"  width="300px">
                <el-menu
                    class="el-menu-vertical-demo"
                    @select="checkDataSubject"
                    :default-active="defaultActive"
                    background-color="#dadde2"
                    text-color="#303133"
                    >
                    <template v-for="(item, index) in checkedAssetObjList">
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
                            ref="checkCategoryBox"
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
                            <!-- <el-input
                                placeholder="输入关键字进行过滤"
                                v-model="filterText">
                            </el-input> -->
                            <template v-for="item in checkedCategoryListAll">
                                <CheckBox
                                    ref="checkBox"
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
import CheckBox from "@/views/assets/assetsManagement/checkBox";
import CheckTag from "@/components/CheckTag"

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
        checkedAssetObjList: {
            type: Array,
            default: () => []
        },
        
        isView: {
            type: Boolean,
            default: false
        },
    },
    data() {
      return {
        // 过滤值
        filterText: '',
        // 过滤后的值
        filterList: {},

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

        // 数据主体类型组合id
        mainBodyIdCp: '',
        // 数据主体类型id
        mainBodyId: 0,
        // 数据主体类型name
        mainBodyName: '',
        // 主体列表
        dataSubjectList: [],
        // 已选主体ids
        checkedDataSubjectIds: [],
        // 已选主体全对象
        checkedDataSubjectObjList: [],

        // 资产id
        projectId: 0,
        // 资产name
        projectName: '',
        // 资产列表
        assetObjList: [],
        currentIndex: undefined,
      };
    },
    watch: {
        'filterText':  {
            handler() {
                this.filterNode(this.filterText, this.fieldList);
            },
            immediate:true
        }
    },
    created() {

    },
    methods: {
        
        filterNode(value, data) {
            console.log(data, '过滤qq')
            if (!value) return this.filterList = data;
            const vals = Object.values(data).flat().filter(i => i.attributesName.indexOf(value) !== -1)
            vals.forEach(a => {
                this.filterList[a.categoryId] = vals.filter(x => x.categoryId === a.categoryId)
            })
            console.log(vals, this.filterList, '过滤')

        },

        //  获取选中的全部数据(传递给父组件)
        getCheckedAssetObjList() {
            return this.checkedAssetObjList
        },
        
        // 选择数据主体类型
        checkDataSubject(index) {

            this.mainBodyId = index*1
            // this.mainBodyIdCp = index
            this.mainBodyName = this.checkedAssetObjList.find(item => item.mainBodyId === this.mainBodyId).mainBodyName
            this.checkedAssetObjList.length !== 0 && this.checkedAssetObjList.forEach((item, index) => {
                console.log(item, 'lllllll');
                    if(item.mainBodyId === this.mainBodyId) {

                        this.categoryList = item.categoryList
                        this.checkedCategoryList = item.checkedCategoryList || []
                        this.checkedCategoryListAll = item.checkedCategoryListAll || []

                        this.dataClassList = item.dataClassList
                        this.checkedDataClass = item.checkedDataClass || []

                        this.checkedFieldList = item.checkedFieldList || {}
                        this.checkedFieldListAll = item.checkedFieldListAll || {}

                        this.fieldList = {...(item.fieldListAll || {})}


                    }
                })
            
            console.log(this.checkedAssetObjList,this.checkedFieldListAll, '切换数据主体')
            this.$nextTick(() => {
                if('checkCategoryBox' in this.$refs) {
                    this.$refs.checkCategoryBox.echoChecked()
                }
                this.$nextTick(() => {
                    if('checkBox' in this.$refs) {
                        this.$refs.checkBox.forEach(item => {
                            item.echoChecked()
                        })
                    }
                 })
            })
            
        },
      
        // 点击字段类别多选框事件
        handleCategoryCheckedChange(checkedList, checkedListAll) {
            this.checkedCategoryList = checkedList
            this.checkedCategoryListAll = checkedListAll
            this.checkedAssetObjList.length !== 0 && this.checkedAssetObjList.forEach((item,index) => {
                if(item.mainBodyId === this.mainBodyId) {
                    item.checkedCategoryList = checkedList
                    item.checkedCategoryListAll = checkedListAll
                }
            })
        },


        // 数据分类多选框点击事件
        handleDataClassCheckedChange(val) {
            console.log(val, 'vallllll');
            this.checkedAssetObjList.length !== 0 && this.checkedAssetObjList.forEach((asset,index) => {
                if(item.mainBodyId === this.mainBodyId) {
                    item.checkedDataClass = val
                }
            })
        },

        // 点击字段多选框事件
        handleFieldCheckedChange(checkedList, checkedListAll, id) {
            checkedListAll.forEach((item,index) => {
                item.projectName = this.projectName
                
                // item.mainBodyIdCp = this.mainBodyIdCp

                item.mainBodyId = this.mainBodyId
                item.mainBodyName = this.mainBodyName
                item.parentProjectName = item.parentProjectAttributesNames ? item.parentProjectAttributesNames : item.parentProjectName
            })

            this.checkedFieldList[id] = checkedList
            this.checkedFieldListAll[id] = checkedListAll

            this.checkedAssetObjList.length !== 0 && this.checkedAssetObjList.forEach((item,index) => {
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
            console.log(this.checkedAssetObjList, checkedListAll, '多选框数据处理')
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
        padding-top: 50px;
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