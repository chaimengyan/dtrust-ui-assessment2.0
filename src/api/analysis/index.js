import request from '@/router/axios'

// 资产分布(部门)
export function getProjectOrderByDepartment(query) {
    return request({
      url: '/assessment/info/getAssetsByLevelAndDept',
      method: 'get',
      params: query
    })
  } 

// 获取最近几个月的资产风险
export function getAssetsLevelByMonth(query) {
    return request({
      url: `/assessment/info/getAssetsLevelByMonth`,
      method: 'get',
      params: query
    })
  }

// 资产分布(字段分级)
export function getProjectOrderByType(query) {
  return request({
    url: '/assets/assetsProject/getProjectOrderByType',
    method: 'get',
    params: query
  })
}

// 业务场景分布(部门)
export function getSceneOrderByDepartment(query) {
    return request({
      url: '/assessment/info/getSceneByLevelAndDept',
      method: 'get',
      params: query
    })
  }

// 获取最近几个月的业务场景风险
export function getBusinessScenarioLevelByMonth(query) {
    return request({
      url: `/assessment/info/getBusinessScenarioLevelByMonth`,
      method: 'get',
      params: query
    })
  }

// 获取最近几个月未评估的资产
export function getRecentlyAssetsAndScene(query) {
  return request({
    url: `/assets/dataPanel/getRecentlyAssetsAndScene`,
    method: 'get',
    params: query
  })
}