import request from '@/router/axios'

// 资产字段数据分类列表分页查询
export function getTypeListByPage(query) {
    return request({
        url: '/assets/assetsAttributesType/getTypeListByPage',
        method: 'get',
        params: query
    })
}

// 获取全部资产字段数据分类
export function getTypeList() {
    return request({
        url: '/assets/assetsAttributesType/getTypeList',
        method: 'get',
    })
}

// 根据id查询字段数据分类详情 
export function getTypeById (id) {
    return request({
      url: `/assets/assetsAttributesType/getTypeById/${id}`,
      method: 'get',
    })
  }

// 资产字段数据分类添加
export function addObj (obj) {
    return request({
        url: '/assets/assetsAttributesType/add',
        method: 'post',
        data: obj
    })
    }

// 资产字段数据分类修改
export function putObj (obj) {
    return request({
        url: '/assets/assetsAttributesType/update',
        method: 'put',
        data: obj
    })
}

// 资产字段数据分类删除
export function delObj(idList) {
    return request({
        url: `/assets/assetsAttributesType/deleteByIdList?idList=${idList}`,
        method: 'delete',
    })
}
