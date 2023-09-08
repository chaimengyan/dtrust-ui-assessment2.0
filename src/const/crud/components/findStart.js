export const findStartOption = (_this) => {
    return {
    submitBtn: false,
    emptyBtn: false,
    labelWidth: 120,
    column: [
        {
            label: _this.$t('findList.任务名称'),
            prop: 'jobName',
            rules: [{
                required: true,
                message: `${_this.$t('crudCommon.请输入')}${_this.$t('findList.任务名称')}`,
                trigger: 'blur'
            }],
            span: 24,
        },
        {
            label: _this.$t('findStart.受访人'),
            prop: 'evaluatorsHandle',
            type: 'select',
            formslot: true,
            rules: [{
                required: true,
                message: `${_this.$t('crudCommon.请选择')}${_this.$t('findStart.受访人')}`,
                trigger: 'change'
            }],
            span: 24,
        },
        {
            label: _this.$t('findStart.任务有效期'),
            prop: 'endTime',
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            rules: [{
                required: true,
                message: `${_this.$t('crudCommon.请选择')}${_this.$t('findStart.任务有效期')}`,
                trigger: 'change'
            }],
            span: 24,
        }
    ]
}
}