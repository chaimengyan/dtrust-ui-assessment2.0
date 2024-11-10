<template>
    <div>
        <div v-for="(item, i) in value" :key="item.id" class="evaluation-content">
            <div class="evaluation-item" >
                <div class="evaluation-item-content">
                    <span class="mr-12">{{ newIndex(i) }}. </span>
                    涉及的资产：
                    <!-- <el-select v-model="relationshipForm.assets" :disabled="false" placeholder="请选择涉及的资产" clearable multiple filterable class="mr-12 flex">
                        <el-option
                            v-for="item in assetsList"
                            :key="item.projectId"
                            :label="item.projectName"
                            :value="item.projectId"
                        />
                    </el-select> -->
                    <el-button type="primary" icon="el-icon-plus" circle @click="handleAdd(item)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="handleDel(item)"></el-button>
                </div>

                <relation-question v-model="item.children" :index="newIndex(i)" @input="onFlush" />
<!-- 
                <div class="assets-card" v-if="relationshipForm.assets.length !==0">
                    <div class="assets-card-header">
                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                        <el-button v-if="checkedAssets.length !==0" icon="el-icon-edit" @click="editAssets" circle></el-button>
                    </div>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="checkedAssets" @change="handleCheckedAssetsChange">
                        <el-checkbox 
                            v-for="assets in assetsList.filter(a=>relationshipForm.assets.includes(a.projectId))" 
                            :label="assets.projectName" 
                            :key="assets.projectId">{{assets.projectName}}</el-checkbox>
                    </el-checkbox-group>
                </div> -->
<!-- 
                <div class="assets-card" v-if="relationshipForm.assets.length !==0">
                    <el-form-item :label="$t('businessScenarioManagement.数据处理活动')" >
                        <el-cascader
                            v-model="relationshipForm.activitiesIdList"
                            :placeholder="`${$t('crudCommon.请选择')}${$t('businessScenarioManagement.数据处理活动')}`"
                            :options="activitiesOptions"
                            :props="{ multiple: true, emitPath: false}"
                            :show-all-levels="false"
                            @change="changeEvent"
                            filterable></el-cascader>
                    </el-form-item>
                    <el-form-item label="">
                        <el-divider></el-divider>
                        <ActAnswers
                            ref="actAnswers"
                            :activitiesList="relationshipForm.assetsSceneProjectAttributesActivitiesList"
                            />
                    </el-form-item>
                </div> -->
            </div>
        </div>
    </div>

</template>

<script>

export default {
    name: "relation-question",
    props: {
        value: {
            type: Array,
            default: () => []
        },
        index: {
            type: Number,
            default: 0
        }
    },
    data() {
      return {
      
      }
    },
    mounted() {
    },
    methods: {
        newIndex(i) {
            return this.index ? `${this.index}-${i + 1}` : i + 1
        },
        change(value) {
            this.$emit('input', value)
            console.log(value, 'v')
        },
        createObject() {
            return {
                id: Math.random()
            }
        },
        handleAdd(record) {
            const index = this.value.findIndex(item => item.id === record.id)
            if (index != -1) {
                const arr = [...this.value]
                arr[index].children = arr[index].children ? [] : [...(arr[index].children || [])]
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
            this.change([...this.value])
        }
    },
}

</script>
<style lang="scss" scoped>

    .child-question {
        margin-top: 0 !important;
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