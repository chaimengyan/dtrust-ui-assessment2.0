import request from '@/router/axios'

// 数据主体列表列表分页查询
export function getMainBodyListByPage(query) {
    return request({
        url: '/assets/assetsAttributesMainBody/getMainBodyListByPage',
        method: 'get',
        params: query
    })
}

// 获取全部数据主体类别
export function getMainBodList() {
    return request({
        url: '/assets/assetsAttributesMainBody/getMainBodList',
        method: 'get',
    })
}

// 根据id查询数据主体详情 
export function getMainBodyById (id) {
    return request({
      url: `/assets/assetsAttributesMainBody/getMainBodyById/${id}`,
      method: 'get',
    })
  }

// 数据主体添加
export function addObj (obj) {
    return request({
        url: '/assets/assetsAttributesMainBody/add',
        method: 'post',
        data: obj
    })
    }

// 数据主体修改
export function putObj (obj) {
    return request({
        url: '/assets/assetsAttributesMainBody/update',
        method: 'put',
        data: obj
    })
}

// 数据主体删除
export function delObj(idList) {
    return request({
        url: `/assets/assetsAttributesMainBody/deleteByIdList?idList=${idList}`,
        method: 'delete',
    })
}

// 根据数据主体id查询资产
export function getProjectsByMainBodyId (id) {
    return request({
      url: `/assets/assetsProjectMainBody/getProjectsByMainBodyId/${id}`,
      method: 'get',
    })
  }

  // 数据主体数量计算 
export function putCalculationObj (obj) {
    return request({
        url: '/assets/assetsProjectMainBody/update',
        method: 'put',
        data: obj
    })
}
