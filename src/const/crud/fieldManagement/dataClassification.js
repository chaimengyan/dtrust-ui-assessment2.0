
export const tableOption = (_this, isOverHidden) => {
  return {
    selection: true,
    reserveSelection:true,
    rowKey: 'typeId',
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
    viewBtn: false,
    menuWidth: 120,
    height: 500, 
    dialogWidth: '35%',
    column: [ {
      label: _this.$t('fieldManagement.数据类型名称'),
      prop: 'typeName',
      span: 24,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
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
  