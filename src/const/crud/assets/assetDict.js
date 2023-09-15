
export const tableOption = (_this, isOverHidden) => {
  return {
  border: false,
  labelWidth: 150,
  index: true,
  indexLabel: _this.$t('crudCommon.序号'),
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  refreshBtn: true,
  delBtn: false,
  editBtn: false,
  showClomnuBtn: false,
  searchMenuSpan: 6,
  searchSize: 'mini',
  menuWidth:120,
  height: 500, 
  dialogWidth: '35%',
  column: [{
    label: '字段label',
    prop: 'label',
    span: 24,
    rules: [{
      required: true,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  }, {
    label: '字段value',
    prop: 'prop',
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
    props:{
      label:'name',
      value:'tableId',
    },
    rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
        trigger: 'change'
      }],
  },{
    label: 'fixed',
    prop: 'fixed',
    value: false,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'span',
    prop: 'span',
    value: 24,
    type: 'number',
    span: 24,
    rules: [{
      required: true,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'hide',
    prop: 'hide',
    value: false,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'editDisplay',
    prop: 'editDisplay',
    value: true,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'addDisplay',
    prop: 'addDisplay',
    value: true,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'display',
    prop: 'display',
    value: true,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'required',
    prop: 'required',
    value: true,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  }, {
    label: 'message',
    prop: "message",
    value: '此项必填',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  }, {
    label: 'trigger',
    prop: "triggerValue",
    value: 'blur',
    span: 24,
    type: 'select',
    dicData: [
      {
        label: 'blur',
        value: 'blur'
      }, {
        label: 'change',
        value: 'change'
      }
    ],
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'overHidden',
    prop: 'overHidden',
    value: true,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },
  // {
  //   label: 'iconList',
  //   prop: 'iconList',
  //   span: 24,
  //   rules: [{
  //     required: false,
  //     message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
  //     trigger: 'blur'
  //   }],
  //   overHidden: isOverHidden,
  // },
  {
    label: 'type',
    prop: 'type',
    type: 'select',
    value: 'input',
    span: 24,
    dicData: [
      {
        label: 'input',
        value: 'input'
      },{
        label: 'number',
        value: 'number'
      },{
        label: 'select',
        value: 'select'
      },{
        label: 'icon',
        value: 'icon'
      },{
        label: 'color',
        value: 'color'
      },{
        label: 'cascader',
        value: 'cascader'
      },{
        label: 'checkbox',
        value: 'checkbox'
      },{
        label: 'radio',
        value: 'radio'
      },{
        label: 'date',
        value: 'date'
      },{
        label: 'time',
        value: 'time'
      },{
        label: 'switch',
        value: 'switch'
      },{
        label: 'upload',
        value: 'upload'
      },{
        label: 'tree',
        value: 'tree'
      },{
        label: 'datetime',
        value: 'datetime'
      }
    ],
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'props',
    prop: 'props',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'dicUrl',
    prop: 'dicUrl',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },
  {
    label: 'formslot',
    prop: 'formslot',
    value: true,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'filterable',
    prop: 'filterable',
    value: true,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'width',
    prop: 'width',
    value: null,
    type: 'number',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'multiple',
    prop: 'multiple',
    value: true,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'editDisabled',
    prop: 'editDisabled',
    value: false,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'format',
    prop: 'format',
    value: 'yyyy-MM-dd',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'valueFormat',
    prop: 'valueFormat',
    value: 'yyyy/MM/dd',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'searchSpan',
    prop: 'searchSpan',
    value: 10,
    type: 'number',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'searchRange',
    prop: 'searchRange',
    value: true,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'search',
    prop: 'search',
    value: false,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: 'sortable',
    prop: 'sortable',
    value: true,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: _this.$t('crudCommon.创建人'),
    prop: 'createBy',
    span: 24,
    editDisplay: false,
    addDisplay: false,
    display: false,
    overHidden: isOverHidden,
  }, {
    width: 150,
    label: _this.$t('crudCommon.创建时间'),
    prop: 'createTime',
    type: 'datetime',
    addDisplay: false,
    editDisabled: true,
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm',
    span: 24,
    overHidden: isOverHidden,
  }, {
    label: _this.$t('crudCommon.修改人'),
    prop: 'updateBy',
    span: 24,
    editDisplay: false,
    addDisplay: false,
    display: false,
    overHidden: isOverHidden,
  }, {
    width: 120,
    label: _this.$t('crudCommon.修改时间'),
    hide: true,
    prop: 'updateTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    editDisabled: false,
    editDisplay: false,
    addDisplay: false,
    display: false,
    span: 24,
    overHidden: isOverHidden,
  }
 ]
}
}

export const tableDictItemOption = (_this, isOverHidden) => {
  return {
  border: false,
  index: true,
  indexLabel: _this.$t('crudCommon.序号'),
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  delBtn: false,
  editBtn: false,
  refreshBtn: true,
  showClomnuBtn: false,
  searchSize: 'mini',
  menuWidth:120,
  height: 400, 
  dialogWidth: '35%',
  editTitle: _this.$t('assetDict.字典项'),
  column: [ {
    width: 150,
    label: _this.$t('assetDict.数据值'),
    prop: 'infoValue',
    span: 24,
    rules: [{
      required: true,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('assetDict.数据值')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: _this.$t('crudCommon.描述'),
    prop: 'description',
    span: 24,
    overHidden: isOverHidden,
  }, {
    label: _this.$t('assetDict.排序'),
    prop: 'sort',
    type: 'number',
    span: 24,
    rules: [{
      required: true,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('assetDict.排序')}`,
      trigger: 'blur'
    }]
  }]
}
}