<template>
    <div>
        <el-form style="margin-left:10px" ref="filterForm" :model="filterForm"   size="">
            <el-row :gutter="20" type="flex" justify="space-around">
                <el-col :span="6">
                <el-form-item label="" >
                    <el-input v-model="filterForm.attributesName" clearable :placeholder="`${$t('crudCommon.请输入')}${$t('fieldManagement.字段名称')}`"></el-input>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                <el-form-item label="">
                    <el-select v-model="filterForm.mainBodyIds" multiple :placeholder="`${$t('crudCommon.请选择')}${$t('fieldManagement.数据主体类别')}`">
                        <el-option 
                            v-for="item in mainBodyList"
                            :key="item.mainBodyId"
                            :label="item.mainBodyName"
                            :value="item.mainBodyId" 
                        />
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                <el-form-item label="">
                    <el-select v-model="filterForm.categoryIds" multiple   :placeholder="`${$t('crudCommon.请选择')}${$t('fieldManagement.字段类别')}`">
                        <el-option 
                            v-for="item in categoryList"
                            :key="item.categoryId"
                            :label="item.categoryName"
                            :value="item.categoryId" 
                        />
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="8">
                <el-form-item label="">
                    <el-select v-model="filterForm.typeIds" multiple    :placeholder="`${$t('crudCommon.请选择')}${$t('fieldManagement.数据分级')}`">
                        <el-option 
                            v-for="item in typeList"
                            :key="item.typeId"
                            :label="item.typeName"
                            :value="item.typeId" 
                        />
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="4">
                <el-button icon="el-icon-search" circle @click="filterFields"></el-button>
                <el-button icon="el-icon-close" circle @click="clearFields"></el-button>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import {
    getMainBodList
} from "@/api/fieldManagement/dataSubjectType";
import {
  getAllAttributesByIds
} from "@/api/fieldManagement/fieldMasterData";
import {
  getCategoryList
} from "@/api/fieldManagement/fieldCategory";
import {
  getTypeList
} from "@/api/fieldManagement/dataClassification";
import { setStore } from '@/util/store'

export default {
    name: 'FilterFields',
    components: {},
    data() {
        return {
            mainBodyList: [],
            categoryList: [],
            typeList: [],
            filterForm: {},
        }
    },
    created() {
        this.initForm()
        this.getMainBodList()
        this.getCategoryList()
        this.getTypeList()

    },
    watch: {
        'filterForm': {
            handler(n, o) {
                this.$emit('svgAutoAdjustment')
            },
            immediate: false,
            deep: true,
        }
    },
    methods: {
        initForm() {
            this.filterForm = {
                attributesName: '',
                mainBodyIds: [],
                categoryIds: [],
                typeIds: [],
            }
        },
        // 筛选字段
        filterFields() {
            console.log(this.filterForm, '搜索字段')
            this.$emit('filterFields', this.filterForm)
        },

        // 清空搜索框
        clearFields() {
            this.initForm()
            this.$emit('filterFields', this.filterForm)
        },
        // 获取全部字段主数据
        getAllAttributesByIds() {
            getAllAttributesByIds().then(res => {

            })
        },
        // 获取全部数据主体类别
        getMainBodList() {
            getMainBodList().then(res => {
                this.mainBodyList = res.data.data
                setStore({
                    name: 'mainBodyList',
                    content: this.mainBodyList
                })

            })
        },
        // 获取全部字段类别
        getCategoryList() {
            getCategoryList().then(res => {
                this.categoryList = res.data.data
                setStore({
                    name: 'categoryList',
                    content: this.categoryList
                })

            })
        },

        // 获取全部数据分类
        getTypeList() {
            getTypeList().then(res => {
                this.typeList = res.data.data
                setStore({
                    name: 'typeList',
                    content: this.typeList
                })

            })
        },
    }
}
</script>

<style scoped="scoped" lang="scss">
  
</style>
