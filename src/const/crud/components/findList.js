export const tableOption = (_this, isOverHidden) => { 
    return {
        // selection: true,
        // reserveSelection:true,
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
        viewBtn:true,
        rowKey: 'id',
        labelWidth: 120,
        menuWidth:120,
        column: [
            {
                label: _this.$t('findList.任务名称'),
                prop: 'jobName',
                span: 24,
                overHidden: isOverHidden,
            },{
                label: _this.$t('findList.任务链接'),
                prop: 'jobUrl',
                type: 'textarea',
                span: 24,
                hide:true,
                display: false,
                overHidden: isOverHidden,
            },{
                label: _this.$t('crudCommon.创建人'),
                prop: 'createBy',
                span: 24,
                overHidden: isOverHidden,
            },{
                label: _this.$t('userinfo.邮箱'),
                prop: 'mail',
                span: 24,
                overHidden: isOverHidden,
            },{
                label: _this.$t('userinfo.手机号'),
                prop: 'mobilePhone',
                span: 24,
                overHidden: isOverHidden,
            },
            {
                label: _this.$t('userinfo.状态'),
                prop: 'status',
                type: 'select',
                dicData: [{
                    label: _this.$t('findList.未填写'),
                    value: 0
                }, {
                    label: _this.$t('findList.已填写'),
                    value: 1
                }],
                search: true,
                span: 24,
                overHidden: isOverHidden,
            }, {
                label: _this.$t('crudCommon.关键字'),
                hide: true,
                prop: 'keyword',
                search: true,
                display: false,
            }
        ],
    }
}
