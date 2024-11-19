import request from '@/router/axios'

// 分页获取跨境活动
export function getTransferActivityByPage(query) {
    return request({
        url: '/assets/transferActivity/page',
        method: 'get',
        params: query
    })
}
// 新增或修改跨境活动
export function saveOrUpdateObj (obj) {
    return request({
        url: '/assets/transferActivity/saveOrUpdate',
        method: 'post',
        data: obj
    })
}

// 批量删除跨境活动
export function delObj(idList) {
    return request({
        url: `/assets/transferActivity?ids=${idList}`,
        method: 'delete',
    })
}
// 根据id获取跨境活动信息
export function getTransferActivityById(id) {
    return request({
        url: `/assets/transferActivity/${id}`,
        method: 'get',
    })
}

// 获取跨境活动泳道图
export function getSwimLaneDiagramsById(id) {
    return request({
        url: `/assets/transferActivity/swimLaneDiagrams?id=${id}`,
        method: 'get',
    })
}