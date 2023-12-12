export const releaseFormOption = (_this) => {
    return {
    submitBtn: false,
    emptyBtn: false,
    labelWidth: 90,
    column: [
        {
            label: _this.$t('evaluationRecord.评估名称'),
            prop: 'assessName',
            rules: [{
                required: true,
                message: `${_this.$t('crudCommon.请输入')}${_this.$t('evaluationRecord.评估名称')}`,
                trigger: 'blur'
            }],
            span: 24,
        },
        {
            label: _this.$t('evaluationRecord.问卷类型'),
            prop: 'type',
            type: 'select',
            formslot: true,
            span: 24,
        },
        {
            label: _this.$t('evaluationRecord.问卷'),
            prop: 'qnId',
            type: 'select',
            formslot: true,
            rules: [{
                required: true,
                message: `${_this.$t('crudCommon.请选择')}${_this.$t('evaluationRecord.问卷')}`,
                trigger: 'change'
            }],
            span: 24,
        },
        {
            label: _this.$t('evaluationRecord.指派方式'),
            prop: 'mode',
            formslot: true,
            span: 24,
        },
        {
            label: _this.$t('evaluationRecord.被评估人'),
            prop: 'evaluators',
            formslot: true,
            rules: [{
                required: true,
                message: `${_this.$t('crudCommon.请选择')}${_this.$t('evaluationRecord.被评估人')}`,
                trigger: 'change'
            }],
            span: 24,
        },
        {
            label: _this.$t('evaluationRecord.审核人'),
            prop: 'auditorIds',
            type: 'select',
            multiple: true,
            dicUrl: '/admin/user/getList',
            props: {
                label: 'nickName',
                value: 'userId',
            },
            rules: [{
                required: true,
                message: `${_this.$t('crudCommon.请选择')}${_this.$t('evaluationRecord.审核人')}`,
                trigger: 'change'
            }],
            span: 24,
        },
        {
            label: _this.$t('evaluationRecord.审核方式'),
            prop: 'sign',
            formslot: true,
            span: 24,
        },
        {
            label: _this.$t('evaluationRecord.有效时间'),
            prop: 'endTime',
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            rules: [{
                required: true,
                message: `${_this.$t('crudCommon.请选择')}${_this.$t('evaluationRecord.有效时间')}`,
                trigger: 'change'
            }],
            span: 24,
        }
    ]
}
}