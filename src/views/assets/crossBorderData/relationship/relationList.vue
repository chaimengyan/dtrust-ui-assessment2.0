<template>
    <div>
        <el-dialog
            v-if="editAssetsDialog"
            :title="$t('crossBorderData.资产信息')" 
            width="60%" 
            :visible.sync="editAssetsDialog" 
            append-to-body
            :close-on-click-modal="false" 
            :fullscreen="isFullscreen">
            <div class="dialog-header" slot="title">
                <span class="dialog-header-title">{{$t('crossBorderData.资产信息')}}</span>
                <div class="dialog-header-screen" @click="() => isFullscreen = !isFullscreen">
                    <i :class="isFullscreen ? 'el-icon-news' : 'el-icon-full-screen'" />
                </div>
            </div> 
            <AssetsInfo ref="assetsInfoRef" :isFirstLevel="!index" :project="project" />
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
            <el-form ref="formRef" :model="item">

                <div class="evaluation-item" >
                    <div class="evaluation-item-content">
                        <div style="flex: 1;">
                            <el-form-item 
                                prop="projectId"
                                style="margin-bottom:0;" 
                                :label="`${newIndex(i)}.${index ? activitiesTypeOptions.find(a=>a.value === parentData.dataActivityType).label:'涉及'}的资产：`"
                                :rules="{ required: true, message: '请选择资产', trigger: 'change' }" >
                                <el-select v-model="item.projectId" @input="onSelectChange(item)" :disabled="false" placeholder="请选择涉及的资产" clearable filterable class="mr-12">
                                    <el-option
                                        v-for="a in assetsList"
                                        :key="a.projectId"
                                        :label="a.projectName"
                                        :value="a.projectId"
                                    />
                                </el-select>
                            </el-form-item>
                        </div>
                        <el-button v-if="item.projectId" icon="el-icon-edit" @click="editAssets(item)" circle></el-button>
                        <el-button 
                            v-if="item.projectId&&'projectInfo' in item && Object.keys(item.projectInfo).length !== 0&&'transferAttributes' in item && item.transferAttributes.length !== 0"
                            @click="showAct(item)">{{!item.isShowAct?'展开处理活动':'收起处理活动'}}</el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click="handleDel(item)"></el-button>

                    </div>

                    <!-- <div class="assets-card" > -->
                    <div v-if="item.projectId">
                        <div v-if="'projectInfo' in item && Object.keys(item.projectInfo).length !== 0" class="assets-card-header">
                            <el-tag>{{$t('assetsManagement.托管位置')}}：{{item.projectInfo.hostingLocation}}</el-tag>
                            <el-tag v-if="item.projectInfo.category !== null">{{$t('assetsManagement.资产类别')}}：{{assetsTypeOptions.find(a=>a.value===item.projectInfo.category).label}}</el-tag>
                        </div>
                        <el-collapse v-if="'transferAttributes' in item && item.transferAttributes.length !== 0">
                            <el-collapse-item :title="$t('crossBorderData.字段信息')" name="1">
                                <div style="white-space: normal;"
                                    v-for="mainBody in handleAttributes(item.transferAttributes)"
                                    :key="mainBody.mainBodyId">
                                    <div>{{mainBody.mainBodyName}}</div>
                                    <div style="margin-left: 10px;" v-for="category in mainBody.children" :key="category.categoryId">
                                        <div style="color:darkgray">{{category.categoryName}}</div>
                                        <div style="margin-left: 10px;">
                                            <el-tag 
                                                v-for="attr in category.children"
                                                :key="attr.attributesId">
                                                {{attr.attributesName}}
                                            </el-tag>
                                        </div>
                                    </div>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>

                    <div v-if="item.isShowAct" class="assets-card" >
                        <div style="display: flex">
                            <div style="flex: 1;">
                                <el-form-item 
                                    :label="$t('crossBorderData.数据处理活动类型')"
                                    prop="dataActivityType"
                                    :rules="{ required: true, message: `${$t('crudCommon.请选择')}${$t('crossBorderData.数据处理活动类型')}`, trigger: 'change' }"  >
                                    <el-select
                                        class="mr-12"
                                        v-model="item.dataActivityType"
                                        :placeholder="`${$t('crudCommon.请选择')}${$t('crossBorderData.数据处理活动类型')}`"
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
                            <div v-if="item.dataActivityType !== null && item.dataActivityType !==''">
                                <el-tooltip effect="dark" :content="$t('添加目标资产')" placement="top">
                                    <el-button type="primary" icon="el-icon-plus" circle @click="handleAdd(item)"></el-button>
                                </el-tooltip>
                            </div>
                        </div>
                    

                        <el-form-item 
                            :label="$t('crossBorderData.数据处理活动描述')"
                            prop="dataActivityDescription"
                            :rules="{ required: true, message: `${$t('crudCommon.请输入')}${$t('crossBorderData.数据处理活动描述')}`, trigger: 'blur' }" >
                            <el-input
                                v-model="item.dataActivityDescription"
                                :placeholder="activitiesDiscPlaceholder[item.dataActivityType]"
                                type="textarea"></el-input>
                        </el-form-item>
                        <el-form-item 
                            :label="$t('crossBorderData.数据量级')"
                            prop="dataScale"
                            :rules="{ required: true, message: `${$t('crudCommon.请选择')}${$t('crossBorderData.数据量级')}`, trigger: 'change' }" >
                            <el-select
                                v-model="item.dataScale"
                                @visible-change="handleOption(parentData)"
                                :placeholder="`${$t('crudCommon.请选择')}${$t('crossBorderData.数据量级')}`"
                                filterable>
                                <el-option
                                    v-for="d in dataScaleOptionsCopy"
                                    :key="d.value"
                                    :label="d.label"
                                    :value="d.value"
                                />
                            </el-select>
                        </el-form-item>
                    </div>
                    <relation-list ref="childRelation" v-model="item.transferRelevanceList" :parentData="item" :filterAttrs="filterAttrs" :index="newIndex(i)" :assetsList="assetsList" @input="onFlush" />

                </div>
            </el-form>
        </div>
      
    </div>

</template>

<script>
import { cloneDeep } from 'lodash'
import AssetsInfo from '@/views/assets/crossBorderData/relationship/assetsInfo'
import { resolve } from '@antv/x6/lib/registry/node-anchor/util';

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
        parentData: {
            type: Object,
            default: () => {}
        },
        filterAttrs: {
            type: Array,
            default: () => []
        }
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
            label: '使用于',
            value: 2
        }],
        dataScaleOptions: [{
            label: '0-10000',
            value: '0'
        },{
            label: '10000-100000',
            value: '1'
        },{
            label: '100000-1000000',
            value: '2'
        },{
            label: '>1000000',
            value: '3'
        }],
        dataScaleOptionsCopy: [],
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
      }
    },
    watch: {
        value() {
            console.log('===----')
        }
    },
    mounted() {
        this.handleOption(this.parentData)
    },
    methods: {
        handleOption(parentData) {
            if(parentData && parentData.dataScale) {
                this.dataScaleOptionsCopy = this.dataScaleOptions.filter(a => a.value < parentData.dataScale||a.value == parentData.dataScale)
            }else {
                this.dataScaleOptionsCopy = this.dataScaleOptions
            }
        },
        validate() {
            return new Promise((resolve, reject) => {
                const list = this.$refs.formRef.map(item => item.validate())
                const listChild = this.$refs.childRelation.map(item => item.validate())

                list.concat(listChild)
                Promise.all(list).then(resolve, reject)
            })
          
        },
        handleMainBodyList(attributes) {
            const mainBodyList = attributes.reduce((acc, cur) => {
                if(!acc.map(a=>a.mainBodyId).includes(cur.mainBodyId)) {
                    acc.push(cur)
                }
                return acc
            }, [])
            console.log(mainBodyList,'bmainBodyList?????');
            return mainBodyList
        },
        handleAttributes(attributes) {
            const result = [];
            // 创建一个辅助对象用于存储 mainBodyId 的引用
            const mainBodyMap = {};
            attributes.forEach(item => {
                // 如果 mainBodyId 不存在于 result 中，创建一个新的 main 对象
                if (!mainBodyMap[item.mainBodyId]) {
                    mainBodyMap[item.mainBodyId] = {
                    mainBodyId: item.mainBodyId,
                    mainBodyName: item.mainBodyName,
                    children: []
                    };
                    result.push(mainBodyMap[item.mainBodyId]);
                }

                // 检查是否已存在 categoryId 的 children
                let cidItem = mainBodyMap[item.mainBodyId].children.find(child => child.categoryId === item.categoryId);
                if (!cidItem) {
                    cidItem = {
                        categoryId: item.categoryId,
                        categoryName: item.categoryName,
                        children: []
                    };
                    mainBodyMap[item.mainBodyId].children.push(cidItem);
                }

                // 添加子字段
                cidItem.children.push({
                    attributesId: item.attributesId,
                    attributesName: item.attributesName
                });
            });
            console.log(result,'resultresultresult');
            return result
        },
        onSelectChange(item) {
            item.transferAttributes = []
            item.projectInfo = {}
            item.dataScale = ''
            item.dataActivityDescription = ''
            item.dataActivityType = ''
            item.isShowAct = false
            if (item.transferRelevanceList) {
                item.transferRelevanceList.forEach(item => {
                    this.onSelectChange(item)
                })
            }
        },
       
        async saveOrUpdate() {
            const data = await this.$refs.assetsInfoRef.assetsResult()
            if(data.transferAttributes.length === 0) {
                return this.$message.error('请选择字段！')
            }
            this.currentLevel.projectInfo = data.projectInfo
            this.currentLevel.transferAttributes = data.transferAttributes || []
            console.log(this.index,data.transferAttributes,this.filterAttrs,'this.index');
           
            this.editAssetsDialog = false
        },
        editAssets(item) {
            // this.isFirstLevel = this.value.map(v=>v.id).includes(item.id)
            this.currentLevel = item
            this.project = this.assetsList.find(a => a.projectId === item.projectId)
            this.editAssetsDialog = true
            console.log(this.filterAttrs,this.project,item.projectInfo,'%%%%%%%%');
            this.$nextTick(() => {
                const project = JSON.stringify(item.projectInfo) === '{}' ? this.project : item.projectInfo
                this.$refs.assetsInfoRef.assetsInfoInit(project, item.transferAttributes, this.filterAttrs)
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
                isShowAct: false,
                dataActivityDescription: '',
                transferRelevanceList: [],
                projectInfo: {},
                transferAttributes: [],
            }
        },
        showAct(item) {
            item.isShowAct = !item.isShowAct;
            this.change([...this.value])
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
::v-deep .el-textarea {
    display: flex;
    width: auto;
}
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