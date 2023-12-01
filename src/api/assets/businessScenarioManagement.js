import request from '@/router/axios'

// 业务场景分页查询
export function getAssetsBusinessSceneByPage(query) {
    return request({
        url: '/assets/assetsBusinessScene/getAssetsBusinessSceneByPage',
        method: 'get',
        params: query
    })
}

// 获取全部业务场景
export function getAllAssetsBusinessScene() {
    return request({
        url: '/assets/assetsBusinessScene/getAllAssetsBusinessScene',
        method: 'get',
    })
}

// 业务场景添加
export function addObj (obj) {
    return request({
        url: '/assets/assetsBusinessScene/add',
        method: 'post',
        data: obj
    })
    }

// 业务场景修改
export function putObj (obj) {
    return request({
        url: '/assets/assetsBusinessScene/update',
        method: 'put',
        data: obj
    })
}

// 业务场景删除
export function delObj(idList) {
    return request({
        url: `/assets/assetsBusinessScene/deleteByIdList?idList=${idList}`,
        method: 'delete',
    })
}

// 业务场景保存关联资产信息
export function addOrUpdateRelatedAssets(obj) {
    return request({
        url: '/assets/assetsSceneProjectAttributes/addOrUpdate',
        method: 'post',
        data: obj
    })
}

// 根据id查询业务场景字段详情
export function getProjectAttributesBySceneId(sceneId) {
    return request({
        url: `/assets/assetsSceneProjectAttributes/getProjectAttributesBySceneId/${sceneId}`,
        method: 'get',
    })
}

  // 业务场景历史记录分页查询
  export function selectBySceneId(query) {
    return request({
      url: '/assets/assetsBusinessSceneHistory/selectBySceneId',
      method: 'get',
      params: query
    })
  }

  // 业务场景审核(新增)
export function auditScene(obj) {
    return request({
        url: `/assets/assetsBusinessScene/audit`,
        method: 'put',
        data: obj
    })
}