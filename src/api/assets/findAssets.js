import request from '@/router/axios'

// 启动发现资产业务场景
export function startFindJob(obj) {
    return request({
        url: '/assets/find/startFindJob',
        method: 'post',
        data: obj
    })
}

// 查询发现资产任务详情
export function getFindJobInfoById(id) {
    return request({
        url: `/assets/find/getFindJobInfoById?id=${id}`,
        method: 'get',
    })
}

// 提交发现资产业务场景任务
export function commitJob(obj) {
    return request({
        url: '/assets/find/commitJob',
        method: 'post',
        data: obj
    })
}

// 查询发现资产业务场景任务详情
export function getFindJobsByPage(query) {
    return request({
        url: '/assets/find/getFindJobsByPage',
        method: 'get',
        params: query
    })
}