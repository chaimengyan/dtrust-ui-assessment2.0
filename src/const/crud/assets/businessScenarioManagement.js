import iconList from "@/const/iconList";
import city from "@/const/json/city"
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

    if(item.prop === 'managingOrganization') {
      item.props = {
        label:'name',
        value:'id'
      }
      getSelectOption(item, tenantId);
    }

    if(item.type === 'icon') {
      item.iconList = iconList
    }

    if(['dataSubjectsRegion','locationsOfPartiesAccessUse','countriesUtilizingProcess'].includes(item.prop)) {
      item.props = {
        label: 'name_cn',
        value: 'code',
        children: 'cities',
      }
      item.dicData = city
    }

  });

   
  _this.option = option
const APIurl = isLinkPage ? `/assets/assetsDict/selectByDictType?tenantId=${tenantId}&dictType=` : '/assets/assetsDict/findByDictType?dictType='
return option
  // return {
  //   labelWidth:200,
  //   selection: true,
  //   reserveSelection:true,
  //   rowKey: 'sceneId',
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
  //   viewBtn: false,
  //   menuWidth:150,
  //   height: 500,  
  //   // submitBtn: false,
  //   column: [{
  //     fixed: true,
  //     label: 'tenantId',
  //     prop: 'tenantId',
  //     noView: true,
  //     span: 24,
  //     hide: true,
  //     editDisplay: false,
  //     addDisplay: false,
  //     viewDisplay: false,
  //     display: false,
  //   }, {
  //     label: _this.$t('businessScenarioManagement.业务场景名称'),
  //     prop: 'sceneName',
  //     search: true,
  //     searchLabelWidth:100,
  //     width: 100,
  //     span: 12,
  //     rules: [{
  //       required: true,
  //       message: `${_this.$t('crudCommon.请输入')}${_this.$t('businessScenarioManagement.业务场景名称')}`,
  //       trigger: 'blur'
  //     }],
  //     overHidden: isOverHidden,
  //   }, {
  //     label: _this.$t('crudCommon.图标'),
  //     prop: 'sceneIcon',
  //     type: 'icon',
  //     iconList: iconList,
  //     rules: [{
  //       required: true,
  //       message: `${_this.$t('crudCommon.请选择')}${_this.$t('crudCommon.图标')}`,
  //       trigger: 'change'
  //     }]
  //   }, {
  //     label: _this.$t('crudCommon.描述'),
  //     prop: 'description',
  //     span: 12,
  //     overHidden: isOverHidden,
  //   }, {
  //     label: _this.$t('crudCommon.颜色'),
  //     prop: 'sceneColor',
  //     type: 'color',
  //     rules: [{
  //       required: true,
  //       message: `${_this.$t('crudCommon.请选择')}${_this.$t('crudCommon.颜色')}`,
  //       trigger: 'change'
  //     }]
  //   },{
  //     label: _this.$t('assetsManagement.所属机构'),
  //     prop: 'managingOrganization',
  //     span: 12,
  //     props:{
  //       label:'name',
  //       value:'id'
  //     },
  //     type:'tree',
  //     filterable: true,
  //     dicUrl: `/admin/dept/getDeptTreeByTenantId?tenantId=${tenantId}`,
  //     rules: [{
  //       required: true,
  //       message: `${_this.$t('crudCommon.请选择')}${_this.$t('assetsManagement.所属机构')}`,
  //       trigger: 'change'
  //     }],
  //     overHidden: isOverHidden,
  //   },
  //   // {
  //   //   label: '业务场景所有者',
  //   //   prop: 'businessProcessOwner',
  //   //   type: 'select',
  //   //   filterable: true,
  //   //   dicUrl: `/admin/user/getList`,
  //   //   width: 120,
  //   //   span: 12,
  //   //   props: {
  //   //     label:'nickName',
  //   //     value:'userId'
  //   //   },
  //   //   rules: [{
  //   //     required: true,
  //   //     message: '请选择业务场景所有者',
  //   //     trigger: 'blur'
  //   //   }],
  //   //   overHidden: isOverHidden,
  //   // },
  //   {
  //     label: _this.$t('assetsManagement.类型'),
  //     prop: 'type',
  //     span: 12,
  //     props:{
  //       label:'dictLabel',
  //       value:'dictValue',
  //     },
  //     type: 'select',
  //     filterable: true,
  //     dicUrl: `${APIurl}business_scenario_type`,
  //     overHidden: isOverHidden,
  //   },{
  //     label: _this.$t('businessScenarioManagement.数据主体区域'),
  //     prop: 'dataSubjectsRegion',
  //     width: 100,
  //     span: 12,
  //     props:{
  //       label: 'name_cn',
  //       value: 'code',
  //       children: 'cities',
  //     },
  //     type: 'cascader',
  //     filterable: true,
  //     dicData: city,
  //     overHidden: isOverHidden,
  //   },
  //   // {
  //   //   label: '数据主体数量',
  //   //   prop: 'dataSubjectsVolume',
  //   //   width: 100,
  //   //   span: 12,
  //   //   editDisplay: false,
  //   //   addDisplay: false,
  //   // },
  //   {
  //     label: _this.$t('businessScenarioManagement.数据处理目的'),
  //     prop: 'purposeOfProcessing',
  //     width: 100,
  //     span: 12,
  //     props:{
  //       label:'dictLabel',
  //       value:'dictValue',
  //     },
  //     type: 'select',
  //     allowCreate:true,
  //     multiple:true,
  //     filterable: true,
  //     dicUrl: `${APIurl}purpose_of_processing`,
  //     overHidden: isOverHidden,
  //   },
  //   // {
  //   //   label: '数据来源',
  //   //   prop: 'dataSource',
  //   //   span: 12,
  //   //   props:{
  //   //     label:'dictLabel',
  //   //     value:'dictValue',
  //   //   },
  //   //   type: 'select',
  //   //   filterable: true,
  //   //   dicUrl: `${APIurl}data_source`,
  //   //   overHidden: isOverHidden,
  //   // },
  //   {
  //     label: _this.$t('businessScenarioManagement.传输方式'),
  //     prop: 'transferMethodFromSources',
  //     width: 150,
  //     span: 12,
  //     props:{
  //       label:'dictLabel',
  //       value:'dictValue',
  //     },
  //     type: 'select',
  //     filterable: true,
  //     dicUrl: `${APIurl}transfer_method_from_sources`,
  //     overHidden: isOverHidden,
  //   },
  //   // {
  //   //   label: '目的地',
  //   //   prop: 'destinations',
  //   //   span: 12,
  //   //   props:{
  //   //     label:'dictLabel',
  //   //     value:'dictValue',
  //   //   },
  //   //   type: 'select',
  //   //   filterable: true,
  //   //   dicUrl: `${APIurl}business_destinations`,
  //   //   overHidden: isOverHidden,
  //   // },
  //   // {
  //   //   label: '传输方式（至目的地）',
  //   //   prop: 'transferMethodToDestinations',
  //   //   width: 150,
  //   //   span: 12,
  //   //   props:{
  //   //     label:'dictLabel',
  //   //     value:'dictValue',
  //   //   },
  //   //   type: 'select',
  //   //   filterable: true,
  //   //   dicUrl: `${APIurl}transfer_method_to_destinations`,
  //   //   overHidden: isOverHidden,
  //   // },
  //    {
  //     label: _this.$t('businessScenarioManagement.数据访问或使用方'),
  //     prop: 'partiesWhoAccessUseData',
  //     width: 150,
  //     span: 12,
  //     props:{
  //       label:'dictLabel',
  //       value:'dictValue',
  //     },
  //     type: 'select',
  //     filterable: true,
  //     dicUrl: `${APIurl}parties_who_access_use_data`,
  //     overHidden: isOverHidden,
  //   },{
  //     label: _this.$t('businessScenarioManagement.访问或使用方地址'),
  //     prop: 'locationsOfPartiesAccessUse',
  //     width: 150,
  //     span: 12,
  //     props:{
  //       label: 'name_cn',
  //       value: 'code',
  //       children: 'cities',
  //     },
  //     type: 'cascader',
  //     filterable: true,
  //     dicData: city,
  //     overHidden: isOverHidden,
  //   },{
  //     label: _this.$t('businessScenarioManagement.数据保留'),
  //     prop: 'dataRetention',
  //     span: 12,
  //     overHidden: isOverHidden,
  //   },{
  //     label: _this.$t('businessScenarioManagement.处理活动的法律基础'),
  //     prop: 'legalBasisForProcessing',
  //     width: 150,
  //     span: 12,
  //     props:{
  //       label:'dictLabel',
  //       value:'dictValue',
  //     },
  //     type: 'select',
  //     filterable: true,
  //     dicUrl: `${APIurl}legal_asis_for_processing`,
  //     overHidden: isOverHidden,
  //   },{
  //     label: _this.$t('businessScenarioManagement.跨境传输机制'),
  //     prop: 'crossBorderTransferMechanism',
  //     width: 120,
  //     span: 12,
  //     props:{
  //       label:'dictLabel',
  //       value:'dictValue',
  //     },
  //     type: 'select',
  //     filterable: true,
  //     dicUrl: `${APIurl}cross_border_transfer_mechanism`,
  //     overHidden: isOverHidden,
  //   },{
  //     label: _this.$t('businessScenarioManagement.境外接收方'),
  //     prop: 'externalId',
  //     span: 12,
  //     overHidden: isOverHidden,
  //   }, {
  //     label: _this.$t('businessScenarioManagement.涉及的国家或地区'),
  //     prop: 'countriesUtilizingProcess',
  //     width: 100,
  //     span: 12,
  //     props:{
  //       label: 'name_cn',
  //       value: 'code',
  //     },
  //     type: 'select',
  //     dicData: city,
  //     filterable: true,
  //     overHidden: isOverHidden,
  //   }, 
  //   // {
  //   //   label: _this.$t('businessScenarioManagement.是否出售居民的个人信息'),
  //   //   prop: 'saleOfPersonalInformationOfCaliforniaResidents',
  //   //   width: 180,
  //   //   span: 24,
  //   //   overHidden: isOverHidden,
  //   // }, {
  //   //   label: _this.$t('businessScenarioManagement.是否出售未成年居民的个人信息'),
  //   //   prop: 'saleOfPersonalInformationOfMinorCaliforniaResidents',
  //   //   width: 220,
  //   //   span: 24,
  //   //   overHidden: isOverHidden,
  //   // }, {
  //   //   label: _this.$t('businessScenarioManagement.居民个人信息销售接收人类别'),
  //   //   prop: 'categoriesOfRecipientsOfSaleOfPersonal',
  //   //   width: 250,
  //   //   span: 24,
  //   //   overHidden: isOverHidden,
  //   // },
  //    {
  //     label: _this.$t('businessScenarioManagement.业务部门'),
  //     prop: 'businessFunction',
  //     span: 12,
  //     props:{
  //       label:'dictLabel',
  //       value:'dictValue',
  //     },
  //     type: 'select',
  //     filterable: true,
  //     dicUrl: `${APIurl}business_function`,
  //     overHidden: isOverHidden,
  //   },{
  //     label: _this.$t('businessScenarioManagement.合法利益'),
  //     prop: 'legitimateInterest',
  //     span: 12,
  //     props:{
  //       label:'dictLabel',
  //       value:'dictValue',
  //     },
  //     type: 'select',
  //     filterable: true,
  //     dicUrl: `${APIurl}legitimate_interest`,
  //     overHidden: isOverHidden,
  //   }, {
  //     label: _this.$t('businessScenarioManagement.数据处理的其他条件'),
  //     prop: 'scheduleConditionForProcessing',
  //     width: 150,
  //     span: 12,
  //     props:{
  //       label:'dictLabel',
  //       value:'dictValue',
  //     },
  //     type: 'select',
  //     filterable: true,
  //     dicUrl: `${APIurl}schedule_condition_for_processing`,
  //     overHidden: isOverHidden,
  //   }, {
  //     label: _this.$t('businessScenarioManagement.设置为主业务场景'),
  //     prop: 'setUpAsMaster',
  //     width: 120,
  //     span: 12,
  //     overHidden: isOverHidden,
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
  //     // search: true,
  //     // searchLabelWidth:100,
  //     editDisabled: false,
  //     addDisplay: false,
  //     editDisplay: false,
  //     span: 12,
  //     display: false,
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
  //     editDisabled: false,
  //     addDisplay: false,
  //     editDisplay: false,
  //     span: 12,
  //     display: false,
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

export const actRelationOption = (_this, isView, isOverHidden) => {
  return {
    selection: !isView,
    selectable:(row,index)=>{
      return !('children' in row);
    },
    rowKey: 'id',
    rowParentKey: 'attributesId',
    reserveSelection:true,
    menu: !isView,
    align:'center',
    menuAlign:'center',
    addBtn: false,
    editBtn: false,
    delBtn: false,
    searchMenuSpan: 5,
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
        width: 100,
        searchLabelWidth:70,
        searchSpan: 4,
        label:_this.$t('assetsManagement.字段名'),
        prop:'attributesName',
        sortable:true,
        search: true,
        overHidden: isOverHidden,

      }, {
        width: 100,
        searchLabelWidth:60,
        searchSpan: 4,
        label:_this.$t('businessScenarioManagement.资产'),
        prop:'projectName',
        sortable:true,
        search: true,
        overHidden: isOverHidden,

      },
      //  {
      //   width: 120,
      //   label:_this.$t('businessScenarioManagement.来源资产'),
      //   prop:'parentProjectName',
      //   sortable:true,
      //   overHidden: isOverHidden,

      // }, 
      {
        width: 120,
        searchSpan: 6,
        label:_this.$t('businessScenarioManagement.数据主体类型'),
        prop:'mainBodyName',
        searchLabelWidth: 100,
        sortable:true,
        search: true,
        overHidden: isOverHidden,

      }, {
        width: 120,
        label:_this.$t('assetsManagement.数据主体数量'),
        prop:'volumeOfDataSubjects',
        sortable:true,
      },
      { 
        label:'收集',
        prop:'gatherActivitiesList',
        overHidden: isOverHidden,
        formatter(_, cur) {
          if (cur && cur.length) {
            return cur.map(item => `${item.activitiesQnLabel}:${item.activitiesAnswerLabel}`).join(';')
          }
        }
      },{ 
        label:'存储',
        prop:'storageActivitiesList',
        overHidden: isOverHidden,
        formatter(_, cur) {
          if (cur && cur.length) {
            return cur.map(item => `${item.activitiesQnLabel}:${item.activitiesAnswerLabel}`).join(';')
          }
        }
      },{ 
        label:'使用',
        prop:'useActivitiesList',
        overHidden: isOverHidden,
        formatter(_, cur) {
          if (cur && cur.length) {
            return cur.map(item => `${item.activitiesQnLabel}:${item.activitiesAnswerLabel}`).join(';')
          }
        }
      },{ 
        label:'传输',
        prop:'transmitActivitiesList',
        overHidden: isOverHidden,
        formatter(_, cur) {
          if (cur && cur.length) {
            return cur.map(item => `${item.activitiesQnLabel}:${item.activitiesAnswerLabel}`).join(';')
          }
        }
      },{ 
        label:'存档/删除',
        prop:'delActivitiesList',
        overHidden: isOverHidden,
        formatter(_, cur) {
          if (cur && cur.length) {
            return cur.map(item => `${item.activitiesQnLabel}:${item.activitiesAnswerLabel}`).join(';')
          }
        }
      },
      // { 
      //   label:_this.$t('businessScenarioManagement.数据处理活动'),
      //   prop:'activitiesName',
      //   overHidden: isOverHidden,
      // },
      {
        searchLabelWidth:70,
        searchSpan: 4,
        label:_this.$t('crudCommon.关键字'),
        prop:'keyword',
        search: true,
        hide: true
      }, 
    ]
  }
}