
import iconList from "@/const/iconList";
export const tableOption = (_this, isOverHidden) => {
return {
    labelWidth: 150,
    selection: true,
    reserveSelection:true,
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
    menuWidth:150,
    height: 500, 
    rowKey: 'projectId',
    column: [ {
      fixed: true,
      label: '资产id',
      prop: 'projectId',
      span: 24,
      hide: true,
      noView: true,
      editDisplay: false,
      addDisplay: false,
      display: false,
    },  {
      label: _this.$t('assetsManagement.资产名称'),
      prop: 'projectName',
      search: true,
      span: 12,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请输入')}${_this.$t('assetsManagement.资产名称')}`,
        trigger: 'blur'
      }],
      overHidden: isOverHidden,
    },
    {
      label: _this.$t('crudCommon.图标'),
      prop: 'projectIcon',
      type: 'icon',
      iconList: iconList,
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('crudCommon.图标')}`,
        trigger: 'change'
      }]
    }, {
      label: _this.$t('crudCommon.颜色'),
      prop: 'projectColor',
      type: 'color',
      rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请选择')}${_this.$t('crudCommon.颜色')}`,
        trigger: 'change'
      }],
      overHidden: isOverHidden,
    },
    {
      label: _this.$t('crudCommon.创建人'),
      prop: 'createBy',
      span: 12,
      editDisplay: false,
      addDisplay: false,
      display: false,
      overHidden: isOverHidden,
    },
    {
      width: 120,
      label: _this.$t('crudCommon.创建时间'),
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      editDisabled: false,
      editDisplay: false,
      addDisplay: false,
      display: false,
      span: 24
    }, {
      label: _this.$t('crudCommon.修改人'),
      prop: 'updateBy',
      span: 12,
      editDisplay: false,
      addDisplay: false,
      display: false,
      overHidden: isOverHidden,
    },
    {
      width: 120,
      label: _this.$t('crudCommon.修改时间'),
      prop: 'updateTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      editDisplay: false,
      addDisplay: false,
      display: false,
      span: 12
    }, {
      label: _this.$t('crudCommon.日期'),
      prop: 'date',
      type:'datetime',
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy/MM/dd',
      display: false,
      hide: true,
      searchSpan:10,
      searchRange:true,
      search:true,
      noView: true,
    }]
  }
}

