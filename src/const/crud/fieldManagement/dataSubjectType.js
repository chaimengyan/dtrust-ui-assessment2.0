
export const tableOption = (_this, isOverHidden) => {
  return {
    selection: true,
    reserveSelection:true,
    rowKey: 'mainBodyId',
    labelWidth: 150,
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
    viewBtn:false,
    menuWidth: 120,
    height: 500, 
    dialogWidth: '35%',
    column: [ {
      label: _this.$t('fieldManagement.数据主体类别'),
      prop: 'mainBodyName',
      span: 24,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据主体类别')}`,
        trigger: 'blur'
      }]
    }, {
      label: _this.$t('crudCommon.创建人'),
      prop: 'createBy',
      span: 24,
      editDisplay: false,
      addDisplay: false,
      overHidden: isOverHidden,
    },
    {
      width: 120,
      label: _this.$t('crudCommon.创建时间'),
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      editDisabled: false,
      addDisplay: false,
      editDisplay: false,
      span: 24
    }, {
      label: _this.$t('crudCommon.修改人'),
      prop: 'updateBy',
      span: 24,
      editDisplay: false,
      addDisplay: false,
      overHidden: isOverHidden,
    },
    {
      width: 120,
      label: _this.$t('crudCommon.修改时间'),
      prop: 'updateTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      editDisabled: false,
      addDisplay: false,
      editDisplay: false,
      span: 24
    }, {
      label: _this.$t('crudCommon.关键字'),
      hide: true,
      prop: 'keyword',
      search: true,
      display: false,
  }]
  }
}

  export const calculationOption =(_this) => {
    return {
    addBtn: false,
    addRowBtn: false,
    delBtn: false,
    cellBtn: true,
    rowKey: 'projectId',
    menuWidth: 250,
    align: 'center',
    menuAlign: 'center',
    editBtnText: _this.$t('fieldManagement.去重'),
    editBtnIcon: 'el-icon-scissors',
    refreshBtn: false,
    columnBtn: false,
    column: [{
        width: 150,
        label: _this.$t('assetsManagement.资产名称'),
        prop: 'projectName',
    },{
        label: _this.$t('fieldManagement.数据主体数量'),
        prop: 'mainBodyNum',
    },{
        label: _this.$t('fieldManagement.去重数量'),
        prop: 'repeatNum',
        type:'number',
        min: 0,
        cell: true
    },{
        label: _this.$t('fieldManagement.去重类型'),
        prop: 'reasonType',
        type: 'select',
        dicData:[{
          label: _this.$t('fieldManagement.重复收集'),
          value:0
        },{
          label: _this.$t('fieldManagement.与其他资产重复'),
          value:1
        }],
        cell: true
      },{
        label: _this.$t('fieldManagement.去重原因'),
        prop: 'reason',
        cell: true
    }]
  }
}