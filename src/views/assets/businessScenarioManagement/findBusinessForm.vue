<template>
    <basic-container>
        <avue-form ref="findBusinessForm" :disabled="!!findStatus" v-model="findBusinessForm" :option="findBusinessFormOption" @submit="submitBtn">
        </avue-form>
    </basic-container>
</template>

<script>
import { tableOption } from "@/const/crud/assets/businessScenarioManagement";
import {
  getTableByName,
  getAssetsFieldByTableName
} from "@/api/customConfiguration/tableConfiguration";
export default {
    name: "FindBusinessForm",
    components: {
    },
    props: {
      findStatus: {
          type: Number,
          default: 0
      },
    },
    data() {
        return {
            treeDeptData: [],
            defaultProps: {
                label: 'name',
                value: 'id'
            },
            // 发现业务场景的表单
            findBusinessForm: {},
            findBusinessFormOption: {},
        }
    },
    // computed: {
    //     findBusinessFormOption() {
    //         return tableOption(this, this.$route.query.tenantId, false, true)
    //     },
    // },
    created() {
        this.getTable()
    },
    methods: {
        //查询table/资产表格/表单配置
        getTable() {
            getTableByName('scene').then(tableRes => {
                getAssetsFieldByTableName('scene').then(res => {
                    this.findBusinessFormOption = {
                        ...tableRes.data.data,
                        column: res.data.data
                    };
                    tableOption(this, this.$route.query.tenantId, false, true, this.findBusinessFormOption)
                    // this.$refs.crud.refreshTable()
                })
            })
        },
        submitBtn(form,done) {
            if(Array.isArray(form.purposeOfProcessing) || typeof form.purposeOfProcessing === 'object') {
                form.purposeOfProcessing = form.purposeOfProcessing.join()
            }
            if(Array.isArray(form.locationsOfPartiesAccessUse)) {
                form.locationsOfPartiesAccessUse = form.locationsOfPartiesAccessUse.join()
            }
            if(Array.isArray(form.dataSubjectsRegion)) {
                form.dataSubjectsRegion = form.dataSubjectsRegion.join()
            }
            if(Array.isArray(form.scheduleConditionForProcessing)) {
                form.scheduleConditionForProcessing = form.scheduleConditionForProcessing.join()
            }
            this.$emit('commitJob', form,done)
        },
    }
}
</script>

<style lang="scss" scoped>

</style>