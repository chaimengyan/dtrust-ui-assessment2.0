import request from '@/router/axios'

// 分页查询评估记录
export function getRisksByPage (query) {
    return request({
        url: '/assessment/evaluation/page',
        method: 'get',
        params: query
    })
}

// 查询风险点
export function getAllAssessScore (tenantId) {
    return request({
        url: `/assessment/level/getAllAssessScore?tenantId=${tenantId}`,
        method: 'get',
        headers: config,
    })
}

// 导出业务场景评估记录的html
export function exportSceneHTML (infoId) {
    return request({
        url: `/assessment/info/exportSceneHTML?infoId=${infoId}`,
        method: 'get',
    })
}

// 获取echarts图数据
export function exportData (infoId) {
    return request({
        url: `/assessment/info/exportData?infoId=${infoId}`,
        method: 'get',
    })
}

// 导出pdf
export function exportPDF (query) {
    return request({
        url: `/assessment/info/exportPDF`,
        method: 'post',
        data: query,
        responseType: 'blob'
    })
}

// 导出业务场景pdf
export function exportScenePDF (query, infoId) {
    return request({
        url: `/assessment/info/exportScenePDF?infoId=${infoId}`,
        method: 'post',
        data: query,
        responseType: 'blob'
    })
}

// 导出资产pdf
export function exportAssetsPDF (query, infoId) {
    return request({
        url: `/assessment/info/exportAssetsPDF?infoId=${infoId}`,
        method: 'post',
        data: query,
        responseType: 'blob'
    })
}