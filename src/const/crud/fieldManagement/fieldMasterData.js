import iconList from "@/const/iconList";
export const tableOption = (_this, isOverHidden) => {
  return {
    selection: true,
    reserveSelection:true,
    border: false,
    index: true,
    indexLabel: _this.$t('crudCommon.序号'),
    stripe: true,
    menuAlign: 'center',
    searchMenuSpan: 4,
    editBtn: false,
    delBtn: false,
    align: 'center',
    addBtn: false,
    viewBtn: false,
    rowKey: 'attributesId',
    labelWidth: 120,
    menuWidth: 120,
    height: 500, 
    dialogWidth: '35%',
    column: [{
      label: _this.$t('fieldManagement.字段名称'),
      prop: 'attributesName',
      span: 24,
      search: true,
      searchLabelWidth:80,
      searchSpan: 5,
      size:'mini',
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.字段名称')}`,
        trigger: 'blur'
      }],
      overHidden: isOverHidden,
    }, {
        label: _this.$t('crudCommon.描述'),
        prop: 'remark',
        span: 24,
        rules: [{
          required: false,
          message: `${_this.$t('crudCommon.请输入')}${_this.$t('crudCommon.描述')}`,
          trigger: 'blur'
        }],
        overHidden: isOverHidden,
      }, {
        label: _this.$t('fieldManagement.数据主体类型'),// 用于搜索
        prop: 'mainBodyId',
        hide: true,
        props: {
            label: 'mainBodyName',
            value: 'mainBodyId'
        },
        type:'select',
        span: 24,
        filterable: true,
        search: true,
        searchLabelWidth:100,
        searchSpan: 5,
        dicUrl: `/assets/assetsAttributesMainBody/getMainBodList`,
        editDisabled: false,
        addDisplay: false,
        editDisplay: false,
        viewDisplay: false,
      },
      {
        label: _this.$t('fieldManagement.字段类别'),
        prop: 'categoryId',
        props: {
            label: 'categoryName',
            value: 'categoryId'
        },
        type:'select',
        span: 24,
        filterable: true,
        search: true,
        searchLabelWidth:80,
        searchSpan: 5,
        dicUrl: `/assets/assetsAttributesCategory/getCategoryList`,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请选择')}${_this.$t('fieldManagement.字段类别')}`,
          trigger: 'change'
        }],
        overHidden: isOverHidden,
      }, {
        label: _this.$t('fieldManagement.数据分级'),
        prop: 'typeId',
        props: {
            label: 'typeName',
            value: 'typeId'
        },
        type:'select',
        span: 24,
        filterable: true,
        search: true,
        searchLabelWidth:80,
        searchSpan: 5,
        dicUrl: `/assets/assetsAttributesType/getTypeList`,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请选择')}${_this.$t('fieldManagement.数据分级')}`,
          trigger: 'change'
        }],
        overHidden: isOverHidden,
      },
      {
        width: 120,
        label: _this.$t('fieldManagement.数据主体类型'),
        prop: 'mainBodyIds',
        props: {
            label: 'mainBodyName',
            value: 'mainBodyId'
        },
        type:'select',
        multiple: true,
        span: 24,
        filterable: true,
        dicUrl: `/assets/assetsAttributesMainBody/getMainBodList`,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请选择')}${_this.$t('fieldManagement.数据主体类型')}`,
          trigger: 'change'
        }],
        overHidden: isOverHidden,
      },
      {
        label: _this.$t('crudCommon.图标'),
        prop: 'attributesIcon',
        type: 'icon',
        value: 'iconfont icon-zd-zhuzhi',
        span: 24,
        iconList: iconList,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请选择')}${_this.$t('crudCommon.图标')}`,
          trigger: 'change'
        }]
      }, {
        label: _this.$t('crudCommon.颜色'),
        prop: 'attributesColor',
        type: 'color',
        value: 'rgba(28, 153, 128, 1)',
        span: 24,
        rules: [{
          required: true,
          message: `${_this.$t('crudCommon.请选择')}${_this.$t('crudCommon.颜色')}`,
          trigger: 'change'
        }]
      },
      {
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
      span: 24,
      overHidden: isOverHidden,
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
      overHidden: isOverHidden,
    }]
  }
}
  