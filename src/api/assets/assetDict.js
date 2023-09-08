import request from '@/router/axios'

// 自定义属性分页
export function getAssetsFieldByPage(query) {
    return request({
      url: '/assets/assetsField/getAssetsFieldByPage',
      method: 'get',
      params: query
    })
  }

// 新增自定义属性
export function addAssetsField (obj) {
    return request({
        url: '/assets/assetsField/add',
        method: 'post',
        data: obj
    })
}

// 修改自定义属性
export function putAssetsField (obj) {
    return request({
        url: '/assets/assetsField/update',
        method: 'put',
        data: obj
    })
}

// 删除自定义属性
export function delAssetsField(idList) {
    return request({
        url: `/assets/assetsField/deleteByIds?idList=${idList}`,
        method: 'delete',
    })
}

// 根据自定义属性id查询字典项列表
export function getFieldInfoPageByFieldId(query) {
    return request({
      url: '/assets/assetsFieldInfo/getFieldInfoPageByFieldId',
      method: 'get',
      params: query
    })
  }

// 新增自定义属性字典项
export function addFieldInfo (obj) {
    return request({
        url: '/assets/assetsFieldInfo/add',
        method: 'post',
        data: obj
    })
}

// 修改自定义属性字典项
export function putFieldInfo (obj) {
    return request({
        url: '/assets/assetsFieldInfo/update',
        method: 'put',
        data: obj
    })
}

// 删除自定义属性字典
export function delFieldInfo(idList) {
    return request({
        url: `/assets/assetsFieldInfo/deleteByIds?idList=${idList}`,
        method: 'delete',
    })
}

// 根据字典类型获取字典项
export function getAssetsDictInfoByDictType(dictType) {
    return request({
      url: `/assets/assetsDictInfo/getAssetsDictInfoByPage?dictType=${dictType}`,
      method: 'get',
    })
  }