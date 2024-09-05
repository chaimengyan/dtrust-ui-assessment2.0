import iconList from "@/const/iconList";

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
    label: _this.$t('tableConfiguration.字段label'),
    prop: 'label',
    tip: _this.$t('tableConfiguration.列标题'),
    span: 24,
    rules: [{
      required: true,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.字段label')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  }, {
    label: _this.$t('tableConfiguration.字段value'),
    prop: 'prop',
    tip: _this.$t('tableConfiguration.列标题的内容属性名称'),
    span: 24,
    rules: [{
      required: true,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.字段value')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },
  {
    label: _this.$t('tableConfiguration.表格类型'),
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
        message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.表格类型')}`,
        trigger: 'change'
      }],
  },{
    label: _this.$t('tableConfiguration.列是否固定'),
    prop: 'fixed',
    value: false,
    type: 'switch',
    span: 24,
    tip: _this.$t('tableConfiguration.列是否固定在左侧或者右侧'),
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.fixed')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: _this.$t('tableConfiguration.栅格占据的列数'),
    prop: 'span',
    value: 24,
    type: 'number',
    tip: _this.$t('tableConfiguration.最大为24撑满一行'),
    span: 24,
    rules: [{
      required: true,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('tableConfiguration.栅格占据的列数')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: _this.$t('tableConfiguration.列是否隐藏'),
    prop: 'hide',
    value: false,
    type: 'switch',
    tip: _this.$t('tableConfiguration.表格中该列是否隐藏'),
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.hide')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: _this.$t('tableConfiguration.表单编辑时项是否显示'),
    prop: 'editDisplay',
    value: true,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.editDisplay')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: _this.$t('tableConfiguration.表单新增时项是否显示'),
    prop: 'addDisplay',
    value: true,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.addDisplay')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: _this.$t('tableConfiguration.弹出表单是否显示'),
    prop: 'display',
    value: true,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: _this.$t('tableConfiguration.是否必填'),
    prop: 'required',
    value: true,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  }, {
    label: _this.$t('tableConfiguration.检验信息'),
    prop: "message",
    value: _this.$t('tableConfiguration.此项必填'),
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  }, {
    label: _this.$t('tableConfiguration.校验触发方式'),
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
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: _this.$t('tableConfiguration.超出隐藏'),
    prop: 'overHidden',
    value: true,
    type: 'switch',
    tip: _this.$t('tableConfiguration.当内容过长被隐藏时显示tooltip'),
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
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
    label: _this.$t('tableConfiguration.组件类型'),
    prop: 'type',
    type: 'select',
    value: 'input',
    span: 24,
    dicData: [
      {
        label: _this.$t('tableConfiguration.输入框'),
        value: 'input'
      },{
        label: _this.$t('tableConfiguration.数字'),
        value: 'number'
      },{
        label: _this.$t('tableConfiguration.下拉选择'),
        value: 'select'
      },{
        label: _this.$t('crudCommon.图标'),
        value: 'icon'
      },{
        label: _this.$t('crudCommon.颜色'),
        value: 'color'
      },
      {
        label: _this.$t('tableConfiguration.级联地址'),
        value: 'cascader'
      },
      {
        label: _this.$t('tableConfiguration.下拉地址'),
        value: 'addressSelect'
      },
      // ,{
      //   label: 'checkbox',
      //   value: 'checkbox'
      // },{
      //   label: 'radio',
      //   value: 'radio'
      // },
      {
        label: _this.$t('crudCommon.日期'),
        value: 'date'
      },{
        label: _this.$t('tableConfiguration.时间'),
        value: 'time'
      },
      // {
      //   label: 'switch',
      //   value: 'switch'
      // },{
      //   label: 'upload',
      //   value: 'upload'
      // },
      // {
      //   label: _this.$t('tableConfiguration.树形'),
      //   value: 'tree'
      // },
      {
        label: _this.$t('tableConfiguration.日期时间'),
        value: 'datetime'
      }
    ],
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
    control: (val, form) => {
      if(val === 'icon') {
        return {
          value: {
            type: 'icon',
            iconList: iconList,
            display: true,
          },
          checkStrictly: {
            display: false,
          },
          multiple: {
            display: false,
          },
          estimate: {
            display: false,
            value: false,
          },
          format: {
            display: false,
          },
          valueFormat: {
            display: false,
          }
        }
      }else if(val === 'color') {
        return {
          value: {
            type: 'color',
            display: true,
          },
          checkStrictly: {
            display: false,
          },
          multiple: {
            display: false,
          },
          estimate: {
            display: false,
            value: false,
          },
          format: {
            display: false,
          },
          valueFormat: {
            display: false,
          }
        }
      }else if(val === 'cascader') {
        return {
          value: {
            display: false,
          },
          checkStrictly: {
            display: true,
          },
          multiple: {
            display: false,
            value: false
          },
          estimate: {
            display: true,
            value: true,
          },
          format: {
            display: false,
          },
          valueFormat: {
            display: false,
          }
        }
      }else if(val === 'addressSelect') {
        return {
          value: {
            display: false,
          },
          checkStrictly: {
            display: false,
          },
          multiple: {
            display: true,
          },
          estimate: {
            display: true,
            value: true,
          },
          format: {
            display: false,
          },
          valueFormat: {
            display: false,
          }
        }
      }else if(val === 'select') {
        return {
          value: {
            display: false,
          },
          checkStrictly: {
            display: false,
          },
          multiple: {
            display: true,
          },
          estimate: {
            display: true,
            value: true,
          },
          format: {
            display: false,
          },
          valueFormat: {
            display: false,
          }
        }
      }else if(val === 'date') {
        return {
          value: {
            display: false,
          },
          checkStrictly: {
            display: false,
          },
          multiple: {
            display: false,
          },
          estimate: {
            display: false,
            value: false,
          },
          format: {
            display: true,
          },
          valueFormat: {
            display: true,
          }
        }
      }else if(val === 'time') {
        return {
          value: {
            display: false,
          },
          checkStrictly: {
            display: false,
          },
          multiple: {
            display: false,
          },
          estimate: {
            display: false,
            value: false,
          },
          format: {
            display: true,
          },
          valueFormat: {
            display: true,
          }
        }
      }else {
        return {
          value: {
            display: false,
          },
          checkStrictly: {
            display: false,
          },
          multiple: {
            display: false,
          },
          estimate: {
            display: true,
            value: true,
          },
          format: {
            display: false,
          },
          valueFormat: {
            display: false,
          }
        }
      }
    }
  },
  {
    label: _this.$t('crudCommon.默认值'),
    prop: 'value',
    type: 'icon',
    iconList: iconList,
    display: false,
    span: 24,
    rules: [{
      required: true,
      message: `${_this.$t('crudCommon.请选择')}${_this.$t('crudCommon.默认值')}`,
      trigger: 'change'
    }]
  },
  {
    label: _this.$t('crudCommon.选中任意节点'),
    prop: 'checkStrictly',
    value: false,
    display: false,
    type: 'switch',
    tip: _this.$t('crudCommon.选中任意节点'),
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },
  // {
  //   label: 'props',
  //   prop: 'props',
  //   span: 24,
  //   rules: [{
  //     required: false,
  //     // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
  //     trigger: 'blur'
  //   }],
  //   overHidden: isOverHidden,
  // },
  // {
  //   label: '数据字典接口url地址',
  //   prop: 'dicUrl',
  //   span: 24,
  //   rules: [{
  //     required: false,
  //     // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
  //     trigger: 'blur'
  //   }],
  //   overHidden: isOverHidden,
  // },
  {
    label: _this.$t('tableConfiguration.该项是否使用表单插槽'),
    prop: 'formslot',
    value: true,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },
  {
    label: _this.$t('tableConfiguration.是否可搜索'),
    prop: 'filterable',
    value: true,
    tip: _this.$t('tableConfiguration.仅对下拉系列组件生效'),
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },
  {
    label: _this.$t('tableConfiguration.对应列的宽度'),
    prop: 'width',
    value: 100,
    type: 'number',
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: _this.$t('tableConfiguration.是否多选'),
    prop: 'multiple',
    display: false,
    value: false,
    tip: _this.$t('tableConfiguration.仅对下拉系列组件生效'),
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: _this.$t('tableConfiguration.表单编辑时项是否禁止'),
    prop: 'editDisabled',
    value: false,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },
  {
    label: _this.$t('tableConfiguration.显示值时间格式'),
    prop: 'format',
    value: 'yyyy-MM-dd HH:mm',
    display: false,
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },{
    label: _this.$t('tableConfiguration.真实值的时间格式'),
    prop: 'valueFormat',
    value: 'yyyy-MM-dd HH:mm',
    display: false,
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },
  {
    label: _this.$t('tableConfiguration.搜索项框栅列'),
    prop: 'searchSpan',
    value: 10,
    type: 'number',
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },
  {
    label: _this.$t('tableConfiguration.搜索项标题宽度'),
    prop: 'searchLabelWidth',
    value: 70,
    type: 'number',
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },
  // {
  //   label: '搜索项为范围搜索',
  //   prop: 'searchRange',
  //   value: true,
  //   type: 'switch',
  //   span: 24,
  //   rules: [{
  //     required: false,
  //     // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
  //     trigger: 'blur'
  //   }],
  //   overHidden: isOverHidden,
  // },
  // {
  //   label: _this.$t('tableConfiguration.是否为搜索项'),
  //   prop: 'search',
  //   value: false,
  //   type: 'switch',
  //   span: 24,
  //   rules: [{
  //     required: false,
  //     // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
  //     trigger: 'blur'
  //   }],
  //   overHidden: isOverHidden,
  // },
  {
    label: _this.$t('tableConfiguration.是否在评估使用'),
    prop: 'estimate',
    value: false,
    display: false,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
      trigger: 'blur'
    }],
    overHidden: isOverHidden,
  },
  {
    label: _this.$t('tableConfiguration.对应列是否可以排序'),
    prop: 'sortable',
    value: false,
    type: 'switch',
    span: 24,
    rules: [{
      required: false,
      // message: `${_this.$t('crudCommon.请输入')}${_this.$t('fieldManagement.数据类型名称')}`,
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
    type: 'textarea',
    minRows: 1,
    maxlength: 50,
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
    type: 'textarea',
    minRows: 1,
    maxlength: 50,
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