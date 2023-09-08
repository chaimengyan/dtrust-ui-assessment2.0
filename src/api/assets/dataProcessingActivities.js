import request from '@/router/axios'

// 数据处理活动分页查询
export function getAssetsActivitiesByPage(query) {
    return request({
        url: '/assets/assetsActivities/getAssetsActivitiesByPage',
        method: 'get',
        params: query
    })
}

// 获取全部数据处理活动
export function getAllAssetsActivities() {
    return request({
        url: '/assets/assetsActivities/getAllAssetsActivities',
        method: 'get',
    })
}

// 数据处理活动添加
export function addObj (obj) {
    return request({
        url: '/assets/assetsActivities/add',
        method: 'post',
        data: obj
    })
    }

// 数据处理活动修改
export function putObj (obj) {
    return request({
        url: '/assets/assetsActivities/update',
        method: 'put',
        data: obj
    })
}

// 数据处理活动删除
export function delObj(idList) {
    return request({
        url: `/assets/assetsActivities/deleteByIdList?idList=${idList}`,
        method: 'delete',
    })
}

// 数据处理活动添加字段
export function addAttributes (obj) {
    return request({
        url: '/assets/assetsActivities/addAttributes',
        method: 'post',
        data: obj
    })
    }

// 根据处理活动id获取处理活动关联的资产字段
export function getActivitiesDataByActivitiesId(id) {
    return request({
        url: `/assets/assetsActivities/getActivitiesDataByActivitiesId/${id}`,
        method: 'get',
    })
}