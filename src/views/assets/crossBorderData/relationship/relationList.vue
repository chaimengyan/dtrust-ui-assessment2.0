<template>
    <div>
        <div v-for="(item, i) in value" :key="item.id" class="evaluation-content">
            <div class="evaluation-item" >
                <div class="evaluation-item-content">
                    <span class="mr-12">{{ newIndex(i) }}. </span>
                    涉及的资产：
                    <el-select v-model="item.projectId" :disabled="false" placeholder="请选择涉及的资产" clearable filterable class="mr-12 flex">
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
                        <el-button v-if="item.projectId" icon="el-icon-edit" @click="editAssets(item)" circle></el-button>
                    </div>
                </div>

                <div class="assets-card" >
                    <el-form-item :label="$t('.数据处理活动类型')" >
                        <el-select
                            v-model="item.dataActivityType"
                            :placeholder="`${$t('crudCommon.请选择')}${$t('.数据处理活动类型')}`"
                            filterable>
                            <el-option
                                v-for="t in activitiesTypeOptions"
                                :key="t.value"
                                :label="t.label"
                                :value="t.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('.数据处理活动描述')" >
                        <el-input
                            v-model="item.dataActivityDescription"
                            :placeholder="activitiesDiscPlaceholder[item.dataActivityType]"
                            type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('.数据量级')" >
                        <el-select
                            v-model="item.dataScale"
                            :placeholder="`${$t('crudCommon.请选择')}${$t('.数据量级')}`"
                            filterable>
                            <el-option
                                v-for="d in dataScaleOptions"
                                :key="d.value"
                                :label="d.label"
                                :value="d.value"
                            />
                        </el-select>
                    </el-form-item>
                </div>
                <relation-list v-model="item.transferRelevanceList" :index="newIndex(i)" :assetsList="assetsList" @input="onFlush" />

            </div>
        </div>
        <el-dialog
            v-if="editAssetsDialog"
            :title="$t('fieldManagement.资产信息')" 
            width="60%" 
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
            <AssetsInfo ref="assetsInfoRef" :project="project" />
            <span slot="footer" class="dialog-footer">
            <el-button
              type="primary"
              icon="el-icon-circle-check"
              v-loading.fullscreen.lock="fullscreenLoading"
              @click="saveOrUpdate">{{$t('assetsManagement.修改')}}</el-button>
            <el-button 
              icon="el-icon-circle-close"
              @click="editAssetsDialog = false">{{$t('assetsManagement.取消')}}</el-button>
  
            </span>
        </el-dialog>
    </div>

</template>

<script>
import { cloneDeep } from 'lodash'
import AssetsInfo from '@/views/assets/crossBorderData/relationship/assetsInfo'

export default {
    name: "relation-list",
    components: { AssetsInfo },
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
        project: {},
        editAssetsDialog: false,
        fullscreenLoading: false,
        activitiesDiscPlaceholder: {
            '0': '请说明传输的方式，如系统直连或是批量等；传输的目的，如涉及跨境或第三方处理；请说明合法性、正当性、必要性',
            '1': '请说明存储的期限，存储的方式，如是否加密等',
            '2': '请说明使用的方式是否涉及自动化决策等'
        },
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
        }],
        currentLevel: {},
      }
    },
    mounted() {
    },
    methods: {
        findNodeById(value, id, data) {
            for (let v of value) {
                if (v.id === id) {
                    const {projectInfo, transferAttributes} = data
                    console.log(v,'vvvv');
                    v.projectInfo = projectInfo
                    v.transferAttributes = transferAttributes
                }else {
                    for (let child of v.transferRelevanceList) {
                        this.findNodeById(child, id, data);
                    }
                }
            }
            
        },
        saveOrUpdate() {

            const data = this.$refs.assetsInfoRef.assetsResult()
            this.value[0].projectInfo = data.projectInfo
            this.value[0].transferAttributes = data.transferAttributes
            // this.findNodeById(this.value,this.currentLevel.id,data)
            this.editAssetsDialog = false
            
        },
        editAssets(item) {
            this.currentLevel = item
            console.log(item,'iiiiitttttt');
            this.project = this.assetsList.find(a => a.projectId === item.projectId)
            console.log(this.project, 'this.project');
            this.editAssetsDialog = true
            this.$nextTick(() => {
                this.$refs.assetsInfoRef.assetsInfoInit(this.project)
            })
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
                dataActivityDescription: ''
            }
        },
        handleAdd(record) {
            const index = this.value.findIndex(item => item.id === record.id)
            if (index != -1) {
                const arr = [...this.value]
                
                arr[index].transferRelevanceList = !arr[index].transferRelevanceList ? [] : [...(arr[index].transferRelevanceList || [])]
                arr[index].transferRelevanceList.push(this.createObject())
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
.assets-card {
    margin-top:10px;
    background-color: #edf4ff;
    padding: 10px;
    border-radius: 8px;
    .assets-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center
    }
}
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