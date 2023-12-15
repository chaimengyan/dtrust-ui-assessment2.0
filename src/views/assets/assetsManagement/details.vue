<template>
    <basic-container>
        <el-tabs type="border-card">
            <el-tab-pane :label="$t('assetsManagement.资产详情')">
                <el-descriptions title="" :column="2" size="mini" border>
                    <template v-for="item,index in viewColumn" >
                        <el-descriptions-item
                            v-if="!item.noView"
                            :label="item.label"
                            :key="index"
                            >
                            <template v-if="['projectIcon','projectColor' ].includes(item.prop)">
                                <div v-if="item.prop === 'projectIcon'" class="cells">
                                    <div>
                                        {{rowData.projectIcon }}
                                    </div>
                                    <i :class="rowData.projectIcon"></i>
                                </div>
                                <div v-if="item.prop === 'projectColor'" class="cells">
                                    <div>
                                        {{rowData.projectColor}}
                                    </div>
                                    <el-color-picker disabled v-model="rowData.projectColor"></el-color-picker>
                                </div>
                            </template>
                            
                            <template v-else>
                                {{handelData(rowData,item.prop)}}
                            </template>
                        </el-descriptions-item>
                    </template>
                </el-descriptions>
            </el-tab-pane>
            <el-tab-pane :label="$t('assetsManagement.关联字段')">
                <FieldRelation
                    ref="fieldRelation" 
                    :projectId="projectId"
                    :isView="true"
                    :fieldList="fieldList"
                    />
            </el-tab-pane>
            <el-tab-pane :label="$t('assetsManagement.资产评估记录')">
                <EvaluationRecord 
                    ref="evaluationRecord"
                    :queryId="{assetsId: projectId}"
                />
            </el-tab-pane>
        </el-tabs>
    </basic-container>
</template>

<script>
import  FieldRelation from "@/views/assets/assetsManagement/fieldRelation";
import  EvaluationRecord from "@/views/assets/components/evaluationRecord";
import {dateFormat} from "@/util/date"
export default {
    name: "Details",
    components: {
        FieldRelation,
        EvaluationRecord
    },
    props: {
        fieldList: {
          type: Array,
          default: () => []
      },
        projectId: {
            type: Number,
            default: 0
        },
        viewColumn: {
            type: Array,
            default: () => []
        },
        rowData: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {

        }
    },
    methods: {
        handelData(obj, key) {
            if(key === "managingOrganization") {
                return obj.$managingOrganization
            } else if(['updateTime', 'createTime'].includes(key) ) {
                return dateFormat(obj[key])
            } else {
                return obj[key]
            }
            
            
        },
    }
}
</script>

<style lang="scss" scoped>
.cells{
    display: flex;
    justify-content: space-around;
    align-items: center;
}
</style>