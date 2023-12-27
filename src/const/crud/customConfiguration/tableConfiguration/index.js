
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
          label: _this.$t('tableConfiguration.标识名称'),
          prop: 'name',
          span: 24,
          rules: [{
            required: true,
            message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.标识名称')}`,
            trigger: 'blur'
          }],
          editDisabled: true,
          overHidden: isOverHidden,
        },
        {
          label: _this.$t('tableConfiguration.标识查询关键词'),
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
            message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.标识查询关键词')}`,
            trigger: 'change'
          }],
          editDisabled: true,
          overHidden: isOverHidden,
        },{
        label: _this.$t('tableConfiguration.标题宽度'),
        prop: 'labelWidth',
        value: 150,
        type: 'number',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.标题宽度')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      }, {
        label: _this.$t('tableConfiguration.是否有选择框'),
        prop: 'selection',
        value: true,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.是否有选择框')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },
      {
        label: _this.$t('tableConfiguration.更新后是否保留勾选'),
        prop: 'reserveSelection',
        value: true,
        tip: _this.$t('tableConfiguration.在数据更新之后保留之前选中的数据'),
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.更新后是否保留勾选')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: _this.$t('tableConfiguration.行数据的Key'),
        prop: 'rowKey',
        span: 24,
        tip: _this.$t('tableConfiguration.用来优化Table的渲染'),
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.行数据的Key')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: _this.$t('tableConfiguration.是否带有纵向边框'),
        prop: 'border',
        value: false,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.是否带有纵向边框')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: _this.$t('tableConfiguration.是否有序号'),
        prop: 'index',
        value: true,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.是否有序号')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: _this.$t('tableConfiguration.是否为斑马纹'),
        prop: 'stripe',
        value: true,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.是否为斑马纹')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: _this.$t('tableConfiguration.操作栏按钮的对齐方式'),
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
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.操作栏按钮的对齐方式')}`,
          trigger: 'change'
        }],
        overHidden: isOverHidden,
      },
      // {
      //   label: 'entityName',
      //   prop: 'entityName',
      //   span: 24,
      //   rules: [{
      //     required: false,
      //     message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      //     trigger: 'blur'
      //   }],
      //   overHidden: isOverHidden,
      // },
      {
        label: _this.$t('tableConfiguration.表格搜索按钮栅列'),
        prop: 'searchMenuSpan',
        value: 6,
        type: 'number',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.表格搜索按钮栅列')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: _this.$t('tableConfiguration.是否显示表格原生修改按钮'),
        prop: 'editBtn',
        value: false,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.是否显示表格原生修改按钮')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: _this.$t('tableConfiguration.是否显示表格原生删除按钮'),
        prop: 'delBtn',
        value: false,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.是否显示表格原生删除按钮')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: _this.$t('tableConfiguration.对齐方式'),
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
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.对齐方式')}`,
          trigger: 'change'
        }],
        overHidden: isOverHidden,
      },{
        label: _this.$t('tableConfiguration.是否显示表格原生新增按钮'),
        prop: 'addBtn',
        value: false,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.是否显示表格原生新增按钮')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: _this.$t('tableConfiguration.是否显示表格原生查看按钮'),
        prop: 'viewBtn',
        value: false,
        type: 'switch',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.是否显示表格原生查看按钮')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: _this.$t('tableConfiguration.操作栏宽度'),
        prop: 'menuWidth',
        value: 120,
        type: 'number',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.操作栏宽度')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      },{
        label: _this.$t('tableConfiguration.表格的高度'),
        prop: 'height',
        value: 500,
        type: 'number',
        tip: _this.$t('tableConfiguration.默认为自动高度'),
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.表格的高度')}`,
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
        search: false,
        display: false,
    }]
    }
  }
    