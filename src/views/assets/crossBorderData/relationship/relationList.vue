<template>
    <div>
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
            <AssetsInfo ref="assetsInfoRef"  :isFirstLevel="!index" :project="project" />
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
                    <el-button @click="showAct()">{{!isShowAct?'展开处理活动':'收起处理活动'}}</el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="handleDel(item)"></el-button>
                    <el-button v-if="item.projectId" icon="el-icon-edit" @click="editAssets(item)" circle></el-button>
                </div>

                <!-- <div class="assets-card" > -->
                <div v-if="item.projectId">
                    <div v-if="'projectInfo' in item && Object.keys(item.projectInfo).length !== 0" class="assets-card-header">
                        <el-tag>位置信息：{{item.projectInfo.hostingLocation}}</el-tag>
                        <el-tag>资产类别：{{assetsTypeOptions.find(a=>a.value===item.projectInfo.category).label}}</el-tag>
                    </div>
                    <el-collapse v-if="'transferAttributes' in item && item.transferAttributes.length !== 0">
                        <el-collapse-item title="字段信息" name="1">
                            <div 
                                style="white-space: normal;"
                                v-for="mainBody in handleAttributes(item.transferAttributes)"
                                :key="mainBody.mainBodyId">
                                <div>{{mainBody.mainBodyName}}</div>
                                <el-tag 
                                    v-for="attr in item.transferAttributes.filter(t=>t.mainBodyId===mainBody.mainBodyId)"
                                    :key="attr.attributesId">
                                    {{attr.attributesName}}
                                </el-tag>

                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>

                <div v-if="isShowAct" class="assets-card" >
                    <div style="display: flex">
                        <div style="flex: 1;">
                            <el-form-item :label="$t('.数据处理活动类型')" >
                            <el-select
                                class="mr-12"
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
                        </div>
                        <div>
                            <el-tooltip class="item" effect="dark" :content="$t('添加目标资产')" placement="top">
                                <el-button type="primary" icon="el-icon-plus" circle @click="handleAdd(item)"></el-button>
                            </el-tooltip>
                        </div>
                    </div>
                 

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
            0: '请说明传输的方式，如系统直连或是批量等；传输的目的，如涉及跨境或第三方处理；请说明合法性、正当性、必要性',
            1: '请说明存储的期限，存储的方式，如是否加密等',
            2: '请说明使用的方式是否涉及自动化决策等'
        },
        activitiesTypeOptions: [{
            label: '传输至',
            value: 0
        },{
            label: '存储于',
            value: 1
        },{
            label: '被使用',
            value: 2
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
        assetsTypeOptions: [
            {
                label: '内部资产',
                value: 0
            },{
                label: '境外内部资产',
                value: 1
            },{
                label: '第三方资产',
                value: 2
            },{
                label: '境外第三方资产',
                value: 3
            },
        ],
        currentLevel: {},
        isFirstLevel: false,
        isShowAct: false,
      }
    },
    watch: {
        value() {
            console.log('===----')
        }
    },
    mounted() {
    },
    methods: {

        handleAttributes(attributes) {
            const mainBodyList = attributes.reduce((acc, cur) => {
                if(!acc.map(a=>a.mainBodyId).includes(cur.mainBodyId)) {
                    acc.push(cur)
                }
                return acc
            }, [])
            return mainBodyList
        },
        saveOrUpdate() {
            const data = this.$refs.assetsInfoRef.assetsResult()
            this.currentLevel.projectInfo = data.projectInfo
            this.currentLevel.transferAttributes = data.transferAttributes
            this.editAssetsDialog = false
        },
        editAssets(item) {
            this.isFirstLevel = this.value.map(v=>v.id).includes(item.id)
            this.currentLevel = item
            this.project = this.assetsList.find(a => a.projectId === item.projectId)
            this.editAssetsDialog = true
            console.log(item, this.project,'>>>>?????');
            this.$nextTick(() => {
                const project = JSON.stringify(item.projectInfo) === '{}' ? this.project : item.projectInfo
                this.$refs.assetsInfoRef.assetsInfoInit(project, item.transferAttributes)
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
                projectId: '',
                dataActivityType: null,
                dataScale: '',
                dataActivityDescription: '',
                transferRelevanceList: [],
                projectInfo: {},
                transferAttributes: [],
            }
        },
        showAct() {
            this.isShowAct = !this.isShowAct
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
            console.log('===')
            this.change(cloneDeep(this.value))
        }
    },
}

</script>
<style lang="scss" scoped>
.assets-card {
    margin-top:10px;
    background-color: #f7faff;
    padding: 10px;
    border-radius: 8px;
    .assets-card-header {
        display: flex;
        // justify-content: space-between;
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