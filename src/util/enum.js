// 数据处理活动类型
export const activitiesCategoryOptions = [
    {
      label: i18n.t('enum.收集'),
      placeholder: i18n.t('enum.例如方式频率目的'),
      value: 0,
      children: []
    },
    {
      label: i18n.t('enum.存储'),
      placeholder: i18n.t('enum.例如存储方式存储期限'),
      value: 1,
      children: []
    },
    {
      label: i18n.t('enum.使用'),
      placeholder: i18n.t('enum.例如自动化决策用户画像访问控制措施'),
      value: 2,
      children: []
    },
    {
      label: i18n.t('enum.传输'),
      placeholder: i18n.t('enum.例如是否出境目的地频率'),
      value: 3,
      children: []
    },
    {
      label: i18n.t('enum.存档或删除'),
      placeholder: i18n.t('enum.例如存档目的存档期限物理删除销毁'),
      value: 4,
      children: []
    },
  ]

  // 评估记录问卷状态
export const assessStatusList = {
  0: {
      type: '',
      label: i18n.t('enum.填写中'),
      value: 0
      },
  1: {
        type: 'info',
        label: i18n.t('evaluationRecord.待审核'),
        value: 1
      },
  2: {
      type: 'warning',
      label: i18n.t('enum.审核中'),
      value: 2
      },
  3: {
      type: 'success',
      label: i18n.t('enum.通过'),
      value: 3
      },
  4: {
      type: 'danger',
      label: i18n.t('enum.拒绝'),
      value: 4
      },
  5: {
      type: '',
      label: i18n.t('enum.驳回中'),
      value: 5
      },
  6: {
      type: 'info',
      label: i18n.t('enum.已截止'),
      value: 6
  },
  7: {
      type: 'warning',
      label: i18n.t('findList.已填写'),
      value: 7
  },
}