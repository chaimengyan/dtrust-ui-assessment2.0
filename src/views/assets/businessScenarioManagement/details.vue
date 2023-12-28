<template>
    <basic-container>
        <el-tabs type="border-card">
            <el-tab-pane :label="$t('businessScenarioManagement.业务场景详情')">
                <el-descriptions title="" :column="2" size="mini" border>
                    <template v-for="item,index in viewColumn" >
                        <el-descriptions-item
                            v-if="!item.noView"
                            :label="item.label"
                            :key="index"
                            >
                            <template v-if="['sceneIcon','sceneColor' ].includes(item.prop)">
                                <div v-if="item.prop === 'sceneIcon'" class="cells">
                                    <div>
                                        {{rowData.sceneIcon }}
                                    </div>
                                    <i :class="rowData.sceneIcon"></i>
                                </div>
                                <div v-if="item.prop === 'sceneColor'" class="cells">
                                    <div>
                                        {{rowData.sceneColor}}
                                    </div>
                                    <el-color-picker disabled v-model="rowData.sceneColor"></el-color-picker>
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
                <ActRelation
                    ref="actRelation" 
                    :sceneId="sceneId"
                    :isView="true"
                    />
            </el-tab-pane>
            <el-tab-pane :label="$t('businessScenarioManagement.业务场景评估记录')">
                <EvaluationRecord 
                    ref="evaluationRecord"
                    :queryId="{sceneId: sceneId}"
                />
            </el-tab-pane>
        </el-tabs>
    </basic-container>
</template>

<script>
import  ActRelation from "@/views/assets/businessScenarioManagement/actRelation";
import  EvaluationRecord from "@/views/assets/components/evaluationRecord";
import {dateFormat} from "@/util/date"
export default {
    name: "Details",
    components: {
        ActRelation,
        EvaluationRecord
    },
    props: {
        fieldList: {
          type: Array,
          default: () => []
      },
        sceneId: {
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
    watch: {
        fieldList() {
            this.$refs.actRelation.init(this.fieldList)
        }
    },
    methods: {
        handelData(obj, key) {
            if(key === "managingOrganization") {
                return obj.$managingOrganization
            }else if(['updateTime', 'createTime'].includes(key) ) {
                return dateFormat(obj[key])
            }else if(['countriesUtilizingProcess', 'dataSubjectsRegion', 'locationsOfPartiesAccessUse'].includes(key) ) {
                return obj[`$${key}`]
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