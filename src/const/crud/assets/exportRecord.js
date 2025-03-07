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
    menu: false,
    column: [ 
   {
        label: _this.$t('exportTemplate.导出人'),
        prop: 'exporter',
        type: 'select',
        span: 24,
        search: true,
        dicUrl: '/admin/user/getList',
        props: {
            label: 'nickName',
            value: 'userId',
        },
        editDisplay: false,
        addDisplay: false,
        overHidden: isOverHidden,
    },
    
    {
        label: _this.$t('exportTemplate.导出时间'),
        prop: 'createTime',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        editDisabled: false,
        addDisplay: false,
        editDisplay: false,
        span: 24
    },
    // {
    //     label: _this.$t('crudCommon.关键字'),
    //     hide: true,
    //     prop: 'keyword',
    //     search: true,
    //     display: false,
    // }
   ]
  }
  }
  