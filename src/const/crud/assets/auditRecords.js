import { getStore } from '@/util/store'

const isZH = getStore({ name: 'language' }) === 'zh-cn'
export const tableOption = (_this, isOverHidden) => { 
    return {
    border: false,
    labelPosition: isZH ? 'right' : 'top',
    index: true,
    indexLabel: '#',
    stripe: true,
    menuAlign: 'center',
    searchMenuSpan: 6,
    searchLabelWidth: 120,
    editBtn: false,
    delBtn: false,
    align: 'center',
    addBtn: false,
    menuWidth:130,
    column: [
        {
            width: 120,
            hide: true,
            label: _this.$t('assetsManagement.资产名称'),
            prop: 'projectId',
            type: 'select',
            dicUrl: '/assets/assetsProject/getAllAssetsProject',
            props: {
                label: 'projectName',
                value: 'projectId'
            },
            sortable:true,
            span: 24,
            overHidden: isOverHidden,
            search: true,
        }, 
    {
        fixed: true,
        width: 120,
        label: _this.$t('assetsManagement.资产名称'),
        prop: 'projectName',
        sortable:true,
        span: 24,
        overHidden: isOverHidden,
    }, {
        width: 120,
        label: _this.$t('evaluationRecord.审计名称'),
        prop: 'name',
        sortable:true,
        span: 24,
        overHidden: isOverHidden,
    }, {
        width: 130,
        label: _this.$t('evaluationRecord.问卷名称'),
        prop: 'qnName',
        sortable:true,
        span: 24,
        overHidden: isOverHidden,
    }, {
        width: 120,
        label: _this.$t('evaluationRecord.被审计人'),
        prop: 'evaluators',
        sortable:true,
        slot: true,
        span: 24,
        overHidden: isOverHidden,
    }, {
        width: 120,
        label: _this.$t('evaluationRecord.审核人'),
        sortable:true,
        slot: true,
        prop: 'auditors',
        span: 24,
        overHidden: isOverHidden,
    },  {
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
        width: 130,
        label: _this.$t('evaluationRecord.审计状态'),
        sortable:true,
        prop: 'status',
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
        label: _this.$t('evaluationRecord.提交时间'),
        prop: 'completedTime',
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
        width: 120,
        label: _this.$t('evaluationRecord.风险点'),
        prop: 'risks',
        sortable:true,
        slot: true,
        span: 24,
        overHidden: isOverHidden,
    }, {
        width: 140,
        label: _this.$t('evaluationRecord.评分标准'),
        prop: 'scoringCriteria',
        sortable:true,
        slot: true,
        span: 24,
        overHidden: isOverHidden,
    }, {
        width: 100,
        label: _this.$t('evaluationRecord.分数'),
        prop: 'scores',
        sortable:true,
        slot: true,
        span: 24,
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
