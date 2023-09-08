import request from '@/router/axios'

// 获取地球数据
export function getMainBodyProjectData(query) {
    return request({
        url: '/assets/assetsProjectAttributes/getMainBodyProjectData',
        method: 'get',
        params: query
    })
}