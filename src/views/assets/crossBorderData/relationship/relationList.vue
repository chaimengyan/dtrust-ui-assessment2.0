<template>
    <div>
        <div v-for="(item, i) in value" :key="item.id" class="evaluation-content">
            <div class="evaluation-item" >
                <div class="evaluation-item-content">
                    <span class="mr-12">{{ newIndex(i) }}. </span>
                    涉及的资产：
                    <el-select v-model="item.assets" :disabled="false" placeholder="请选择涉及的资产" clearable filterable class="mr-12 flex">
                        <el-option
                            v-for="a in assetsList"
                            :key="a.projectId"
                            :label="a.projectName"
                            :value="a.projectId"
                        />
                    </el-select>
                    <el-button type="primary" icon="el-icon-plus" circle @click="handleAdd(item)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="handleDel(item)"></el-button>
                </div>

                <div class="assets-card" >
                    <div class="assets-card-header">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <el-button v-if="checkedAssets.length !==0" icon="el-icon-edit" @click="editAssets" circle></el-button>
                    </div>
                    <div style="margin: 15px 0;"></div>
                    <!-- <el-checkbox-group v-model="checkedAssets" @change="handleCheckedAssetsChange">
                        <el-checkbox 
                            v-for="assets in assetsList.filter(a=>item.assets.includes(a.projectId))" 
                            :label="assets.projectName" 
                            :key="assets.projectId">{{assets.projectName}}</el-checkbox>
                    </el-checkbox-group> -->
                </div>

                <div class="assets-card" >
                    <el-form-item :label="$t('.数据处理活动类型')" >
                        <el-select
                            v-model="item.activitiesIdList"
                            :placeholder="`${$t('crudCommon.请选择')}${$t('.数据处理活动类型')}`"
                            :options="activitiesTypeOptions"
                            :props="{ multiple: false}"
                            @change="changeEvent"
                            filterable></el-select>
                    </el-form-item>
                    <el-form-item :label="$t('.数据处理活动描述')" >
                        <el-input
                            v-model="item.activitiesDisc"
                            :placeholder="`${$t('crudCommon.请选择')}${$t('.数据处理活动描述')}`"
                            type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('.数据量级')" >
                        <el-select
                            v-model="item.dataScale"
                            :placeholder="`${$t('crudCommon.请选择')}${$t('.数据量级')}`"
                            :options="dataScaleOptions"
                            :props="{ multiple: false}"
                            @change="changeEvent"
                            filterable></el-select>
                    </el-form-item>
                </div>
                <relation-list v-model="item.children" :index="newIndex(i)" :assetsList="assetsList" @input="onFlush" />

            </div>
        </div>
        <el-dialog
            :title="$t('fieldManagement.资产信息')" 
            width="40%" 
            :visible.sync="editAssetsDialog" 
            append-to-body
            :close-on-click-modal="false" 
            :fullscreen="isFullscreen">
            <div class="dialog-header" slot="title">
                <span class="dialog-header-title">{{$t('fieldManagement.资产信息')}}</span>
                <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
                    <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
                </div>
            </div> 
            <AssetsInfo />
            <span slot="footer" class="dialog-footer">
            <!-- <el-button
              type="primary"
              icon="el-icon-circle-check"
              v-loading.fullscreen.lock="fullscreenLoading"
              @click="sumbitDataSubject">{{$t('assetsManagement.修改')}}</el-button>
            <el-button 
              icon="el-icon-circle-close"
              @click="dataSubjectDialog = false">{{$t('assetsManagement.取消')}}</el-button> -->
  
            </span>
        </el-dialog>
    </div>

</template>

<script>
import { cloneDeep } from 'lodash'
export default {
    name: "relation-list",
    props: {
        value: {
            type: Array,
            default: () => []
        },
        index: {
            type: [Number, String],
            default: 0
        },
        assetsList: {
            type: Array,
            default: () => []
        },
    },
    data() {
      return {
        isFullscreen: false,

        checkAll: false,
        checkedAssets: [],
        isIndeterminate: true,

        editAssetsDialog: false,

        activitiesTypeOptions: [{
            label: '传输至',
            value: '0'
        },{
            label: '存储于',
            value: '1'
        },{
            label: '被使用',
            value: '2'
        }],
        dataScaleOptions: [{
            label: '一百万',
            value: '0'
        },{
            label: '二百万',
            value: '1'
        },{
            label: '三百万',
            value: '2'
        }]
      }
    },
    mounted() {
    },
    methods: {
        changeEvent() {},
        editAssets() {
            this.editAssetsDialog = true
        },
        handleCheckAllChange(val) {
            this.checkedAssets = val ? this.relationshipForm.assets : [];
            this.isIndeterminate = false;
        },
        handleCheckedAssetsChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.relationshipForm.assets.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.relationshipForm.assets.length;
        },
        newIndex(i) {
            return this.index ? `${this.index}-${i + 1}` : i + 1
        },
        change(value) {
            this.$emit('input', value)
            console.log(value, 'v')
        },
        createObject() {
            return {
                id: Math.random(),
                activitiesDisc: ''
            }
        },
        handleAdd(record) {
            const index = this.value.findIndex(item => item.id === record.id)
            if (index != -1) {
                const arr = [...this.value]
                
                arr[index].children = !arr[index].children ? [] : [...(arr[index].children || [])]
                arr[index].children.push(this.createObject())
                this.change(arr)
            }
           
        },
        handleDel(record) {
            const index = this.value.findIndex(item => item.id === record.id)
            if (index != -1) {
                const arr = [...this.value]
                arr.splice(index, 1)
                this.change(arr)
            } 
        },
        onFlush() {
            this.change(cloneDeep(this.value))
        }
    },
}

</script>
<style lang="scss" scoped>

    .evaluation-content, .child-question {
        margin-top: 40px;
        border: 1px solid #c7c7c7;
        border-radius: 4px;
        box-shadow: 2px 2px 4px #c7c7c7;
        padding: 10px;
        .evaluation-item {
            padding: 12px;
            white-space: nowrap;
            color: #000;

            border-bottom: 1px solid #eee;

            
            .evaluation-item-content {
                display: flex;
                align-items: center;
                margin-bottom: 12px;

                .icon {
                    font-size: 20px;
                    cursor: pointer;

                    &.primary {
                        color: #409eff;
                    }

                    &.error {
                        color: red;
                    }
                }
            }

            .flex {
                width: 0;
                flex: 1;
            }

            .mr-12 {
                margin-right: 12px;
            }
        }
    }

</style>