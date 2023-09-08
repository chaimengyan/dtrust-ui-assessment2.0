
export const tableOption = (_this, isOverHidden) => {
    return {
      selection: true,
      reserveSelection:true,
      rowKey: 'fieldId',
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
        label: '字段label',
        prop: 'fieldName',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      }, {
        label: '字段value',
        prop: 'fieldNameValue',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },
      {
        label: '类型',
        prop: 'parentId',
        type:'select',
        span: 24,
        filterable: true,
        search: true,
        searchLabelWidth:100,
        searchSpan: 5,
        dicUrl: 'assets/assetsTable/getAssetsTable',
        rules: [{
            required: false,
            message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
            trigger: 'change'
          }],
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
    