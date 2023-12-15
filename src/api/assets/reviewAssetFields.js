import request from '@/router/axios'


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

// 资产一键审核
export function batchAudit(obj) {
    return request({
        url: '/assets/assetsProject/audit',
        method: 'put',
        data: obj
    })
}