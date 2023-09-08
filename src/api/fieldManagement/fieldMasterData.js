import request from '@/router/axios'

// 字段主数据列表分页查询
export function getAttributesByPage(query) {
    return request({
        url: '/assets/assetsAttributes/getAttributesByPage',
        method: 'get',
        params: query
    })
}

// 根据id查询字段主数据详情
export function getAttributesById (id) {
    return request({
      url: `/assets/assetsAttributes/getAttributesById/${id}`,
      method: 'get',
    })
  }

// 获取全部字段主数据
export function getAllAttributesByIds(categoryIds, typeIds, mainBodyIds, attributesName) {
    return request({
        url: `/assets/assetsAttributes/getAllAttributesByIds?categoryIds=${categoryIds}&typeIds=${typeIds}&mainBodyIds=${mainBodyIds}&attributesName=${attributesName}`,
        method: 'get',
    })
}

// 资产字段主数据添加
export function addObj (obj) {
    return request({
        url: '/assets/assetsAttributes/add',
        method: 'post',
        data: obj
    })
    }

// 资产字段主数据修改
export function putObj (obj) {
    return request({
        url: '/assets/assetsAttributes/update',
        method: 'put',
        data: obj
    })
}

// 资产字段主数据删除
export function delObj(idList) {
    return request({
        url: `/assets/assetsAttributes/deleteByIdList?idList=${idList}`,
        method: 'delete',
    })
}

// 字段主数据批量修改数据主体
export function updateMainBodies (obj) {
    return request({
        url: '/assets/assetsAttributes/updateMainBodies',
        method: 'put',
        data: obj
    })
}
