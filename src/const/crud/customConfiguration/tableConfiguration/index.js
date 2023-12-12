
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
      column: [ 
        {
          label: '标识名称',
          prop: 'name',
          span: 24,
          rules: [{
            required: true,
            message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
            trigger: 'blur'
          }],
          editDisabled: true,
          overHidden: isOverHidden,
        },
        {
          label: 'tableName',
          prop: 'tableName',
          type: 'select',
          span: 24,
          dicData: [
            {
              label: 'asset',
              value: 'asset',
            }, {
              label: 'scene',
              value: 'scene'
            }
          ],
          rules: [{
            required: true,
            message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
            trigger: 'change'
          }],
          editDisabled: true,
          overHidden: isOverHidden,
        },{
        label: 'labelWidth',
        prop: 'labelWidth',
        value: 150,
        type: 'number',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      }, {
        label: 'selection',
        prop: 'selection',
        value: true,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },
      {
        label: 'reserveSelection',
        prop: 'reserveSelection',
        value: true,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: 'rowKey',
        prop: 'rowKey',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: 'border',
        prop: 'border',
        value: false,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: 'index',
        prop: 'index',
        value: true,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: 'stripe',
        prop: 'stripe',
        value: true,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: 'menuAlign',
        prop: 'menuAlign',
        value: 'center',
        span: 24,
        type: 'select',
        dicData: [
          {
            label: 'left',
            value: 'left'
          },{
            label: 'center',
            value: 'center'
          },{
            label: 'right',
            value: 'right'
          }
        ],
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'change'
        }],
        overHidden: isOverHidden,
      },{
        label: 'entityName',
        prop: 'entityName',
        span: 24,
        rules: [{
          required: false,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: 'searchMenuSpan',
        prop: 'searchMenuSpan',
        value: 6,
        type: 'number',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: 'editBtn',
        prop: 'editBtn',
        value: false,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: 'delBtn',
        prop: 'delBtn',
        value: false,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: 'align',
        prop: 'align',
        value: 'center',
        span: 24,
        type: 'select',
        dicData: [
          {
            label: 'left',
            value: 'left'
          },{
            label: 'center',
            value: 'center'
          },{
            label: 'right',
            value: 'right'
          }
        ],
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'change'
        }],
        overHidden: isOverHidden,
      },{
        label: 'addBtn',
        prop: 'addBtn',
        value: false,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: 'viewBtn',
        prop: 'viewBtn',
        value: false,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: 'menuWidth',
        prop: 'menuWidth',
        value: 120,
        type: 'number',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: 'height',
        prop: 'height',
        value: 500,
        type: 'number',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },
      {
        width: 120,
        label: _this.$t('crudCommon.创建时间'),
        prop: 'createTime',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
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
    