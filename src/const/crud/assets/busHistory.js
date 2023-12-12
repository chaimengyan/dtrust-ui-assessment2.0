
export const tableOption = (_this, isOverHidden) => {
    return {
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
    viewBtn:true,
    // height: 500,
    menuWidth: 120, 
    column: [{
        fixed: true,
        label: 'id',
        prop: 'id',
        span: 24,
        hide: true,
        editDisplay: false,
        addDisplay: false,
        viewDisplay: false
    }, {
        width: 100,
        label: _this.$t('businessScenarioManagement.业务场景变化'),
        prop: 'sceneChange',
        type: 'textarea',
        span: 24,
        minRows: 1,
        overHidden: isOverHidden,
    }, {
        label: _this.$t('assetsManagement.新增字段'),
        prop: 'projectAdd',
        type: 'textarea',
        span: 24,
        minRows: 1,
        overHidden: isOverHidden,
    }, {
        label: _this.$t('assetsManagement.删除字段'),
        prop: 'projectDel',
        type: 'textarea',
        span: 24,
        minRows: 1,
        overHidden: isOverHidden,
        },
    {
        label: _this.$t('assetsManagement.修改来源'),
        prop: 'evaluationName',
        type: 'textarea',
        span: 24,
        minRows: 1,
        overHidden: isOverHidden,
        },
    {
        label: _this.$t('businessScenarioManagement.编辑字段'),
        prop: 'projectUpdate',
        type: 'textarea',
        span: 24,
        minRows: 1,
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
        span: 24,
    }, {
        label: _this.$t('crudCommon.关键字'),
        hide: true,
        prop: 'keyword',
        search: true,
        display: false,
    }
   ]
   }
  }
  