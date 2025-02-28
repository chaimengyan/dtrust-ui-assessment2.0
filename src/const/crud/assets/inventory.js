export const tableOption = (_this, isOverHidden) => {
    return {
    labelWidth: 150,
    border: false,
    index: true,
    indexLabel: '#',
    stripe: true,
    menuAlign: 'center',
    searchMenuSpan: 6,
    editBtn: false,
    delBtn: false,
    align: 'center',
    addBtn: false,
    viewBtn:true,
    // height: 500, 
    menuWidth: 120,
    column: [ 
    {
        width: 120,
        label: _this.$t('assetsManagement.发起盘点时间'),
        prop: 'initiateTime',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        editDisabled: false,
        addDisplay: false,
        editDisplay: false,
        span: 24
    }, {
        width: 150,
        label: _this.$t('assetsManagement.发起人'),
        prop: 'initiatorName',
        span: 24,
        editDisplay: false,
        addDisplay: false,
        overHidden: isOverHidden,
    },{
        width: 120,
        label: _this.$t('assetsManagement.盘点时间'),
        prop: 'checkTime',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        editDisabled: false,
        addDisplay: false,
        editDisplay: false,
        span: 24
    },{
        width: 150,
        label: _this.$t('assetsManagement.盘点人'),
        prop: 'checkerName',
        span: 24,
        editDisplay: false,
        addDisplay: false,
        overHidden: isOverHidden,
    },
    {
        width: 150,
        label: _this.$t('assetsManagement.盘点状态'),
        prop: 'status',
        type: 'select',
        dicData: [
            {
                label: _this.$t('assetsManagement.待盘点'),
                value: 0,
            },
            {
                label: _this.$t('assetsManagement.已盘点'),
                value: 1,
            },
        ],
        span: 24,
        editDisplay: false,
        addDisplay: false,
        overHidden: isOverHidden,
    },
    {
        label: _this.$t('crudCommon.关键字'),
        hide: true,
        prop: 'keyword',
        search: true,
        display: false,
    }
   ]
  }
  }
  