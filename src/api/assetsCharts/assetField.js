import request from '@/router/axios'

// 获取资产列表
export function getAssets(query) {
    return request({
        url: '/assets/dataPanel/getAssets',
        method: 'get',
        params: query
    })
}

// 分页获取字段 
export function getAttributes(query) {
    return request({
        url: '/assets/dataPanel/getAttributes',
        method: 'get',
        params: query
    })
}

// 根据资产获取字段关系
export function getAttributesByAssetsId(projectIds) {
    return request({
        url: `/assets/dataPanel/getAttributesByAssetsId?projectIds=${projectIds}`,
        method: 'get',
    })
}

// 选中字段的详细信息 
export function getAttributesByIds(attributesIds) {
    return request({
        url: `/assets/dataPanel/getAttributesByIds?attributesIds=${attributesIds}`,
        method: 'get',
    })
}

// 获取选中资产字段与其他选中资产字段之间是否存在关系
export function getAssetsRelation(attributesIds) {
    return request({
        url: `/assets/dataPanel/getAssetsRelation?attributesIds=${attributesIds}`,
        method: 'get',
    })
}

// 根据字段获取资产信息
export function getAssetsByAttributesId(attributesId) {
    return request({
        url: `/assets/dataPanel/getAssetsByAttributesId?attributesId=${attributesId}`,
        method: 'get',
    })
}