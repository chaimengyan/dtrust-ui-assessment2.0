import request from '@/router/axios'

// 分页获取跨境活动
export function getTransferActivityByPage(query) {
    return request({
        url: '/assets/transferActivity',
        method: 'get',
        params: query
    })
}
