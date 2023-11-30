import request from '@/router/axios'

// 资产分页查询
export function getAssetsProjectByPage(query) {
    return request({
      url: '/assets/assetsProject/getAssetsProjectByPage',
      method: 'get',
      params: query
    })
  }

  // 查询所有资产
export function getAllAssetsProject() {
    return request({
      url: '/assets/assetsProject/getAllAssetsProject',
      method: 'get',
    })
  }
  
// 根据资产id查询资产详情
export function getAssetsProjectById(id) {
    return request({
        url: `/assets/assetsProject/getAssetsProjectById/${id}`,
        method: 'get',
    })
}

// 根据资产id查询字段
export function getAssetsProjectAttributesListByProjectId(id) {
    return request({
        url: `/assets/assetsProjectAttributes/getAssetsProjectAttributesListByProjectId/${id}`,
        method: 'get',
    })
}

// 根据资产id查询业务场景
export function getSceneByProjectId(id) {
    return request({
        url: `/assets/assetsProjectScene/getSceneByProjectId/${id}`,
        method: 'get',
    })
}

// 根据字段id查询拥有当前字段的资产(用于添加资产时选择字段来源)
export function getAssetsProjectAttributesByAttributeId(fieldId, mainBodyId, assetsId) {
    return request({
        url: `/assets/assetsProjectAttributes/getAssetsProjectAttributesByAttributeId/${fieldId}/${mainBodyId}/${assetsId}`,
        method: 'get',
    })
}

// 根据字段id和数据主体id和资产id查询拥有当前字段的资产(用于添加资产时批量选择字段来源)
export function getAssetsProjectAttributes(obj) {
    return request({
        url: `/assets/assetsProjectAttributes/getAssetsProjectAttributes`,
        method: 'post',
        data: obj
    })
}

// 资产添加
export function addObj (obj) {
    return request({
        url: '/assets/assetsProject/add',
        method: 'post',
        data: obj
    })
    }

// 资产修改
export function putObj (obj) {
    return request({
        url: '/assets/assetsProject/update',
        method: 'put',
        data: obj
    })
}

// 资产删除
export function delObj(idList) {
    return request({
        url: `/assets/assetsProject/deleteByIdList?idList=${idList}`,
        method: 'delete',
    })
}

// 资产添加字段
export function assetsAddAttributes (obj) {
    return request({
        url: '/assets/assetsProjectAttributes/addOrUpdate',
        method: 'post',
        data: obj
    })
}

// 根据租户id查询部门
export function getDeptTreeByTenantId (tenantId) {
    return request({
      url: `/admin/dept/getDeptTreeByTenantId?tenantId=${tenantId}`,
      method: 'get',
    })
  }

  // 资产历史记录分页查询
export function getAssetsProjectHistoryByPage(query) {
    return request({
      url: '/assets/assetsProjectHistory/getAssetsProjectHistoryByPage',
      method: 'get',
      params: query
    })
  }

  // 根据资产id查询字段(业务场景用)
export function getProjectAttributesListByProjectId(id) {
    return request({
        url: `/assets/assetsProjectAttributes/getProjectAttributesListByProjectId/${id}`,
        method: 'get',
    })
}

 // 根据资产id查询待审核字段
 export function getAttributesListByProjectId(query) {
    return request({
        url: `/assets/assetsProjectAttributes/getAttributesListByProjectId`,
        method: 'get',
        params: query
    })
}

 // 资产审核
 export function auditAssetsField(obj) {
    return request({
        url: `/assets/assetsProjectAttributes/audit`,
        method: 'put',
        data: obj
    })
}

// 资产历史版本分页查询
export function getVersionProjectByPage(query) {
    return request({
        url: `/assets/assetsProject/getVersionProjectByPage`,
        method: 'get',
        params: query
    })
}