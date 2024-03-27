
export const tableOption = (_this, isOverHidden) => {
    return {
    border: false,
    labelWidth: 150,
    selection: true,
    reserveSelection:true,
    index: true,
    indexLabel: _this.$t('crudCommon.序号'),
    stripe: true,
    menuAlign: 'center',
    align: 'center',
    refreshBtn: true,
    delBtn: false,
    editBtn: false,
    addBtn: false,
    showClomnuBtn: false,
    searchMenuSpan: 6,
    searchSize: 'mini',
    menuWidth:120,
    height: 500, 
    rowKey: 'id',
    dialogWidth: '35%',
    column: [{
      label: _this.$t('exportTemplate.模板名称'),
      prop: 'templateName',
      span: 24,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请输入')}${_this.$t('exportTemplate.模板名称')}`,
        trigger: 'blur'
      }],
      overHidden: isOverHidden,
    }, {
      label: _this.$t('crudCommon.描述'),
      prop: 'description',
      span: 24,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请输入')}${_this.$t('crudCommon.描述')}`,
        trigger: 'blur'
      }],
      overHidden: isOverHidden,
    },
   {
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
    },
    {
        label:_this.$t('crudCommon.关键字'),
        prop:'keyword',
        search: true,
        hide: true,
        display: false,
    },
   ]
  }
  }
  
  export const exportRecordOption = (_this, isOverHidden) => {
    return {
    border: false,
    index: true,
    indexLabel: _this.$t('crudCommon.序号'),
    stripe: true,
    menuAlign: 'center',
    menu:false,
    align: 'center',
    addBtn:false,
    delBtn: false,
    editBtn: false,
    refreshBtn: true,
    showClomnuBtn: false,
    searchSize: 'mini',
    menuWidth:120,
    height: 400, 
    dialogWidth: '35%',
    column: [ {
      width: 150,
      label: _this.$t('evaluationRecord.评估名称'),
      prop: 'evaluationName',
      span: 24,
      overHidden: isOverHidden,
    },{
      label: _this.$t('assetsManagement.资产名称'),
      prop: 'assetsName',
      span: 24,
      overHidden: isOverHidden,
    }, {
      label: _this.$t('businessScenarioManagement.业务场景名称'),
      prop: 'sceneName',
      span: 24,
      overHidden: isOverHidden,
    }, {
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
    },]
  }
  }