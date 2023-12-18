
import iconList from "@/const/iconList";
import {
  getDeptTreeByTenantId
} from "@/api/assets/assetsManagement";

// item.dicUrl 调接口
function getSelectOption(item, tenantId) {
  getDeptTreeByTenantId(tenantId).then(res => {
    item.dicData = res.data.data || []
  })
}

export const tableOption = (_this, tenantId, isOverHidden, isLinkPage, option) => {


  option.column.forEach((item, index) => {
    item.isOverHidden = isOverHidden
    Reflect.deleteProperty(item, 'props')

    if (item.dicUrl) {
      getSelectOption(item, tenantId);
    }

    if(item.type === 'icon') {
      item.iconList = iconList
    }
    else if(item.prop === 'managingOrganization') {
      item.props = {
        label:'name',
        value:'id'
      }
      getSelectOption(item, tenantId);
    }
  });
  //fieldType iconList searchLabelWidth width
  _this.option = option

// const APIurl = isLinkPage ? `/assets/assetsDict/selectByDictType?tenantId=${tenantId}&dictType=` : '/assets/assetsDict/findByDictType?dictType='
// return option
// return {
  //   labelWidth: 150,
  //   selection: true,
  //   reserveSelection:true,
  //   border: false,
  //   index: true,
  //   indexLabel: _this.$t('crudCommon.序号'),
  //   stripe: true,
  //   menuAlign: 'center',
  //   searchMenuSpan: 6,
  //   editBtn: false,
  //   delBtn: false,
  //   align: 'center',
  //   addBtn: false,
  //   viewBtn:false,
  //   menuWidth:150,
  //   height: 500,
  //   rowKey: 'projectId',
  //   column: [{
  //     fixed: true,
  //     label: '租户id',
  //     prop: 'tenantId',
  //     span: 24,
  //     hide: true,
  //     noView: true,
  //     editDisplay: false,
  //     addDisplay: false,
  //     display: false,
  //   }, {
  //     fixed: true,
  //     label: '资产id',
  //     prop: 'projectId',
  //     span: 24,
  //     hide: true,
  //     noView: true,
  //     editDisplay: false,
  //     addDisplay: false,
  //     display: false,
  //   },  {
  //     label: _this.$t('assetsManagement.资产名称'),
  //     prop: 'projectName',
  //     search: true,
  //     span: 12,
  //     rules: [{
  //       required: true,
  //       message: `${_this.$t('crudCommon.请输入')}${_this.$t('assetsManagement.资产名称')}`,
  //       trigger: 'blur'
  //     }],
  //     overHidden: isOverHidden,
  //   },
  //   {
  //     label: _this.$t('crudCommon.图标'),
  //     prop: 'projectIcon',
  //     type: 'icon',
  //     iconList: iconList,
  //     rules: [{
  //       required: true,
  //       message: `${_this.$t('crudCommon.请选择')}${_this.$t('crudCommon.图标')}`,
  //       trigger: 'change'
  //     }]
  //   }, {
  //     label: _this.$t('crudCommon.颜色'),
  //     prop: 'projectColor',
  //     type: 'color',
  //     rules: [{
  //       required: true,
  //       message: `${_this.$t('crudCommon.请选择')}${_this.$t('crudCommon.颜色')}`,
  //       trigger: 'change'
  //     }],
  //     overHidden: isOverHidden,
  //   },
  //    {
  //     label: _this.$t('assetsManagement.所属机构'),
  //     prop: 'managingOrganization',
  //     span: 12,
  //     props:{
  //       label:'name',
  //       value:'id'
  //     },
  //     type:'tree',
  //     dicUrl: `/admin/dept/getDeptTreeByTenantId?tenantId=${tenantId}`,
  //     rules: [{
  //       required: true,
  //       message: `${_this.$t('crudCommon.请选择')}${_this.$t('assetsManagement.所属机构')}`,
  //       trigger: 'change'
  //     }],
  //     overHidden: isOverHidden,
  //   },
  //   // {
  //   //   label: '经纬度',
  //   //   prop: 'LongitudeAndLatitude',
  //   //   span: 12,
  //   //   formslot: true,
  //   //   hide: true,
  //   // },
  //   {
  //     label: _this.$t('assetsManagement.托管位置'),
  //     prop: 'hostingLocation',
  //     span: 12,
  //     formslot: true,
  //     // disabled: true,
  //     rules: [{
  //       required: true,
  //       message: `${_this.$t('crudCommon.请选择')}${_this.$t('assetsManagement.托管位置')}`,
  //       trigger: 'change'
  //     }],
  //     overHidden: isOverHidden,
  //   },{
  //     label: _this.$t('assetsManagement.经度'),
  //     prop: 'lng',
  //     span: 12,
  //     disabled: true,
  //     display: false,
  //     hide: true,

  //     rules: [{
  //       required: true,
  //       message: `${_this.$t('crudCommon.请选择')}${_this.$t('assetsManagement.经度')}`,
  //       trigger: 'change'
  //     }]
  //   },{
  //     label: _this.$t('assetsManagement.纬度'),
  //     prop: 'lat',
  //     span: 12,
  //     disabled: true,
  //     display: false,
  //     hide: true,
  //     rules: [{
  //       required: true,
  //       message: `${_this.$t('crudCommon.请选择')}${_this.$t('assetsManagement.纬度')}`,
  //       trigger: 'change'
  //     }]
  //   },{
  //     label: _this.$t('assetsManagement.类型'),
  //     prop: 'type',
  //     span: 12,
  //     props:{
  //       label:'dictLabel',
  //       value:'dictValue',
  //     },
  //     type: 'select',
  //     filterable: true,
  //     dicUrl: `${APIurl}asset_type`,
  //     overHidden: isOverHidden,
  //   },{
  //     label: _this.$t('assetsManagement.内部或第三方'),
  //     prop: 'internalOr3rdParty',
  //     width: 100,
  //     span: 12,
  //     props:{
  //       label:'dictLabel',
  //       value:'dictValue',
  //     },
  //     type: 'select',
  //     filterable: true,
  //     dicUrl: `${APIurl}internal_or3rd_party`,
  //     overHidden: isOverHidden,
  //   },
  //   // {
  //   //   label: _this.$t('assetsManagement.储存格式'),
  //   //   prop: 'storageFormat',
  //   //   span: 12,
  //   //   props:{
  //   //     label:'dictLabel',
  //   //     value:'dictValue',
  //   //   },
  //   //   type: 'select',
  //   //   filterable: true,
  //   //   dicUrl: `${APIurl}storage_format`,
  //   //   overHidden: isOverHidden,
  //   // }, {
  //   //   label: _this.$t('assetsManagement.托管类型'),
  //   //   prop: 'hostingType',
  //   //   span: 12,
  //   //   props:{
  //   //     label:'dictLabel',
  //   //     value:'dictValue',
  //   //   },
  //   //   type: 'select',
  //   //   filterable: true,
  //   //   dicUrl: `${APIurl}hosting_type`,
  //   //   overHidden: isOverHidden,
  //   // },
  //   {
  //     label: _this.$t('assetsManagement.托管方'),
  //     prop: 'hostingProvider',
  //     span: 12,
  //   }, {
  //     label: _this.$t('assetsManagement.技术安全措施'),
  //     prop: 'technicalSecurityMeasures',
  //     width: 100,
  //     span: 12,
  //     props:{
  //       label:'dictLabel',
  //       value:'dictValue',
  //     },
  //     type: 'select',
  //     filterable: true,
  //     dicUrl: `${APIurl}technical_security_measures`,
  //     overHidden: isOverHidden,
  //   }, {
  //     label: _this.$t('assetsManagement.组织安全措施'),
  //     prop: 'organizationalSecurityMeasures',
  //     width: 100,
  //     span: 12,
  //     props:{
  //       label:'dictLabel',
  //       value:'dictValue',
  //     },
  //     type: 'select',
  //     multiple:true,
  //     filterable: true,
  //     dicUrl: `${APIurl}organizational_security_measures`,
  //     overHidden: isOverHidden,
  //   },
  //    {
  //     label: _this.$t('assetsManagement.数据主体数量'),
  //     prop: 'volumeOfDataSubjects',
  //     width: 100,
  //     type: 'number',
  //     span: 12,
  //     display: false,
  //   },
  //    {
  //     label: _this.$t('assetsManagement.数据丢弃方式'),
  //     prop: 'dataDisposal',
  //     width: 100,
  //     span: 12,
  //     props:{
  //       label:'dictLabel',
  //       value:'dictValue',
  //     },
  //     type: 'select',
  //     filterable: true,
  //     dicUrl: `${APIurl}data_disposal`,
  //     overHidden: isOverHidden,
  //   }, {
  //     label: _this.$t('assetsManagement.设置为主资产'),
  //     prop: 'etUpAsMaster',
  //     width: 100,
  //     span: 12,
  //   }, {
  //     label: _this.$t('crudCommon.创建人'),
  //     prop: 'createBy',
  //     span: 12,
  //     editDisplay: false,
  //     addDisplay: false,
  //     display: false,
  //     overHidden: isOverHidden,
  //   },
  //   {
  //     width: 120,
  //     label: _this.$t('crudCommon.创建时间'),
  //     prop: 'createTime',
  //     type: 'datetime',
  //     format: 'yyyy-MM-dd HH:mm',
  //     editDisabled: false,
  //     editDisplay: false,
  //     addDisplay: false,
  //     display: false,
  //     span: 24
  //   }, {
  //     label: _this.$t('crudCommon.修改人'),
  //     prop: 'updateBy',
  //     span: 12,
  //     editDisplay: false,
  //     addDisplay: false,
  //     display: false,
  //     overHidden: isOverHidden,
  //   },
  //   {
  //     width: 120,
  //     label: _this.$t('crudCommon.修改时间'),
  //     prop: 'updateTime',
  //     type: 'datetime',
  //     format: 'yyyy-MM-dd HH:mm',
  //     editDisplay: false,
  //     addDisplay: false,
  //     display: false,
  //     span: 12
  //   }, {
  //     label: _this.$t('crudCommon.日期'),
  //     prop: 'date',
  //     type:'datetime',
  //     format: 'yyyy-MM-dd',
  //     valueFormat: 'yyyy/MM/dd',
  //     display: false,
  //     hide: true,
  //     searchSpan:10,
  //     searchRange:true,
  //     search:true,
  //     noView: true,
  //   }]
  // }
}

export const fieldRelationOption = (_this, isView, isOverHidden) => {
  return {
    selection: !isView,
    rowKey: '_id',
    reserveSelection:true,
    menu: !isView,
    align:'center',
    menuAlign:'center',
    addBtn: false,
    editBtn: false,
    delBtn: false,
    searchSpan: 8,
    searchMenuSpan: 6,
    column:[
      {
        label: "资产id",
        prop: "projectId",
        hide: true,
      },
      {
        label: "字段id",
        prop: "attributesId",
        hide: true,
      },
      {
        label: "数据主体类型id",
        prop: "mainBodyId",
        hide: true,
      },
      {
        width: 120,
        label:_this.$t('assetsManagement.数据主体类型'),
        prop:'mainBodyName',
        sortable:true,
        overHidden: isOverHidden,
      },
      {
        label:_this.$t('assetsManagement.字段名'),
        prop:'attributesName',
        sortable:true,
        overHidden: isOverHidden,
      },
      {
        label:_this.$t('assetsManagement.字段来源'),
        prop:'sourceName',
        type: 'select',
        dicData: [{
          label: '直接来自个人',
          value: '0'
        }, {
          label: '内部系统',
          value: '1'
        }, {
          label: '第三方系统',
          value: '2'
        }, {
          label: '离线导入',
          value: '3'
        },],
        sortable:true,
        overHidden: isOverHidden,
      },
      {
        label:_this.$t('assetsManagement.字段数量'),
        prop:'dataSubjectsVolume',
        sortable:true,
      },
      {
        label:_this.$t('crudCommon.关键字'),
        prop:'keyword',
        search: true,
        hide: true
      },
    ]
  }
}
