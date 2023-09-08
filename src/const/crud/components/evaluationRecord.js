export const tableOption = (_this, isOverHidden) => { 
    return {
    border: false,
    index: true,
    indexLabel: _this.$t('crudCommon.序号'),
    stripe: true,
    menuAlign: 'center',
    searchMenuSpan: 6,
    editBtn: false,
    delBtn: false,
    align: 'center',
    addBtn: false,
    menuWidth:130,
    column: [{
        fixed: true,
        width: 100,
        label: _this.$t('evaluationRecord.评估名称'),
        prop: 'assessName',
        sortable:true,
        span: 24,
        overHidden: isOverHidden,
    }, {
        width: 100,
        label: _this.$t('evaluationRecord.问卷名称'),
        prop: 'qnName',
        sortable:true,
        span: 24,
        overHidden: isOverHidden,
    }, {
        width: 100,
        label: _this.$t('evaluationRecord.被评估人'),
        prop: 'evaluatorName',
        sortable:true,
        slot: true,
        span: 24,
        overHidden: isOverHidden,
    }, {
        width: 100,
        label: _this.$t('evaluationRecord.审核人'),
        sortable:true,
        slot: true,
        prop: 'auditorsNickName',
        span: 24,
        overHidden: isOverHidden,
    }, {
        width: 100,
        label: _this.$t('evaluationRecord.评估状态'),
        sortable:true,
        prop: 'assessStatus',
        slot: true,
        type: 'select',
        dicData: [
            {
                label: _this.$t('evaluationRecord.填写中'),
                value: 1
            },
            {
                label: _this.$t('evaluationRecord.审核中'),
                value: 2
            },
            {
                label: _this.$t('evaluationRecord.通过'),
                value: 3
            },
            {
                label: _this.$t('evaluationRecord.拒绝'),
                value: 4
            },
            {
                label: _this.$t('evaluationRecord.已驳回'),
                value: 5
            },
        ],
        overHidden: isOverHidden,
        search: true,
        span: 24,
    }, 
    {
        width: 150,
        label: _this.$t('evaluationRecord.发布时间'),
        sortable:true,
        prop: 'releaseTime',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        span: 24,
        overHidden: isOverHidden,
    }, {
        width: 150,
        label: _this.$t('evaluationRecord.有效时间'),
        sortable:true,
        prop: 'endTime',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        span: 24,
        overHidden: isOverHidden,
    }, {
        width: 150,
        label: _this.$t('evaluationRecord.填写时间'),
        prop: 'writeTime',
        slot: true,
        sortable:true,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        span: 24,
        overHidden: isOverHidden,
    }, {
        width: 150,
        label: _this.$t('evaluationRecord.审核时间'),
        prop: 'auditorTime',
        sortable:true,
        slot: true,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        span: 24,
        overHidden: isOverHidden,
    }, {
        width: 100,
        label: _this.$t('evaluationRecord.风险点'),
        prop: 'questionLevels',
        sortable:true,
        slot: true,
        span: 24,
        overHidden: isOverHidden,
    }, {
        width: 100,
        label: _this.$t('evaluationRecord.评分标准'),
        prop: 'type',
        sortable:true,
        slot: true,
        span: 24,
        overHidden: isOverHidden,
    }, {
        label: _this.$t('evaluationRecord.分数'),
        prop: 'grade',
        sortable:true,
        slot: true,
        span: 24,
        overHidden: isOverHidden,
    }, {
        width: 100,
        label: _this.$t('evaluationRecord.风险等级'),
        prop: 'level',
        sortable:true,
        span: 24,
        type: 'select',
        dicData: [
            {
                label: _this.$t('crudCommon.低'),
                value: '低'
            },
            {
                label: _this.$t('crudCommon.中'),
                value: '中'
            },
            {
                label: _this.$t('crudCommon.高'),
                value: '高'
            },
            {
                label: _this.$t('crudCommon.极高'),
                value: '极高'
            },
        ],
        search: true,
        slot: true,
        overHidden: isOverHidden,
    }, {
        fixed: false,
        label: _this.$t('crudCommon.关键字'),
        hide: true,
        prop: 'keyword',
        search: true,
        editDisplay: false,
        addDisplay: false,
        addDisabled: true,
        editDisabled: true,
        disabled: true
    },]
    }
}
