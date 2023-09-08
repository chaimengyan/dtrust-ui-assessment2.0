<template>
    <basic-container>
        <avue-form ref="findBusinessForm" :disabled="!!findStatus" v-model="findBusinessForm" :option="findBusinessFormOption" @submit="submitBtn">
        </avue-form>
    </basic-container>
</template>

<script>
import { tableOption } from "@/const/crud/assets/businessScenarioManagement";
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
        }
    },
    computed: {
        findBusinessFormOption() {
            return tableOption(this, this.$route.query.tenantId, false, true)
        },
    },
    created() {
    },
    methods: {
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
            this.$emit('commitJob', form,done)
        },
    }
}
</script>

<style lang="scss" scoped>

</style>