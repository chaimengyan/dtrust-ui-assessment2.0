import request from '@/router/axios'

// 资产字段类别分页查询
export function getCategoryListByPage(query) {
    return request({
        url: '/assets/assetsAttributesCategory/getCategoryListByPage',
        method: 'get',
        params: query
    })
}

// 获取全部资产字段类别
export function getCategoryList() {
    return request({
        url: '/assets/assetsAttributesCategory/getCategoryList',
        method: 'get',
    })
}

// 根据id查询字段类别详情 
export function getCategoryById (id) {
    return request({
      url: `/assets/assetsAttributesCategory/getCategoryById/${id}`,
      method: 'get',
    })
  }

// 资产字段类别添加
export function addObj (obj) {
    return request({
        url: '/assets/assetsAttributesCategory/add',
        method: 'post',
        data: obj
    })
    }

// 资产字段类别修改
export function putObj (obj) {
    return request({
        url: '/assets/assetsAttributesCategory/update',
        method: 'put',
        data: obj
    })
}

// 资产字段类别删除
export function delObj(idList) {
    return request({
        url: `/assets/assetsAttributesCategory/deleteByIdList?idList=${idList}`,
        method: 'delete',
    })
}
