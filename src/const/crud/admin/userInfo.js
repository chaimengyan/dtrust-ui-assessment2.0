
export const tableOption = (_this, tenantId) => {
  // 设置手机号的验证规则
const checkPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error(_this.$t('userinfo.手机号不能为空')))
  } else {
    const reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    if (reg.test(value)) {
      callback()
    } else {
      return callback(new Error(_this.$t('userinfo.请输入正确的电话')))
    }
  }
}
  /**
 * 校验邮箱
 */
 const isEmail = (rule, value, callback) => {
  const myreg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (myreg.test(value)||!value) {
    callback()
  } else {
    return callback(new Error(_this.$t('userinfo.请输入正确的邮箱')))
  }
}
  return {
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
  emptyBtn:false,
  submitBtn:false,
  dialogWidth: '35%',
  column: [{
    fixed: true,
    label: 'id',
    prop: 'userId',
    span: 24,
    hide: true,
    display: false,
  }, {
    label: _this.$t('userinfo.用户名'),
    prop: 'username',
    disabled: true,
    slot: true,
    search: true,
    span: 24,
  }, {
    label: _this.$t('userinfo.用户昵称'),
    prop: 'nickName',
    span: 24,
    rules: [{
      required: true,
      message: `${_this.$t('crudCommon.请输入')}${_this.$t('userinfo.用户昵称')}`
    },
    {
      min: 2,
      max: 20,
      message: _this.$t('userinfo.长度在2到20个字符'),
      trigger: 'blur'
    },
    ],
  },
   {
    label: _this.$t('userinfo.手机号'),
    prop: 'mobilePhone',
    value: '',
    span: 24,
    rules: [{
      required: true,
      message: _this.$t('userinfo.手机号不能为空'),
      trigger: 'blur'
    }, {
      validator: checkPhone,
      trigger: 'blur'
    }],
  }, {
    label: _this.$t('userinfo.角色'),
    prop: 'roleList',
    // formslot: true,
    type: 'select',
    dicUrl: '/admin/role/list',
    multiple:true,
    props: {
        label: 'roleName',
        value: 'roleId',
    },
    span: 24,
    disabled: true,
  },
  {
    label: _this.$t('userinfo.租户'),
    prop: 'tenantName',
    span: 24,
    disabled: true,
  }, {
    label: _this.$t('userinfo.所属部门'),
    prop: 'deptId',
    type: 'tree',
    dicUrl: `/admin/dept/getDeptTreeByTenantId?tenantId=${tenantId}`,
    props: {
        label: 'name',
        value: 'id',
    },
    span: 24,
    disabled: true,
  },  {
    label: _this.$t('userinfo.状态'),
    prop: 'lockFlag',
    type: 'radio',
    border: true,
    span: 24,
    dicData: [{
      label: _this.$t('userinfo.有效'),
      value: '0'
    }, {
      label: _this.$t('userinfo.锁定'),
      value: '9'
    }],
    disabled: true,
  },{
    label: _this.$t('userinfo.邮箱'),
    prop: 'mail',
    value: '',
    span: 24,
    rules: [{
        required: true,
        message: `${_this.$t('crudCommon.请输入')}${_this.$t('userinfo.邮箱')}`,
        trigger: 'blur'
    }, {
        validator: isEmail,
        trigger: 'blur'
    }],
  }, {
    width: 120,
    label: _this.$t('crudCommon.创建时间'),
    prop: 'createTime',
    type: 'datetime',
    format: 'yyyy-MM-dd',
    disabled: true,
    span: 24,
  }]
}
}
