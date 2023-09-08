import request from '@/router/axios'

// 根据自定义属性id查询字典项列表
export function getFieldInfoPageByFieldId(query) {
    return request({
        url: '/assets/assetsFieldInfo/getFieldInfoPageByFieldId',
        method: 'get',
        params: query
    })
}

// 组织架构配置自定义属性
export function addOrUpdate() {
    return request({
        url: '/assets/assetsDeptField/addOrUpdate',
        method: 'post',
    })
}

// 查询资产表格/表单配置
export function getAssetsFieldByTableId (obj) {
    return request({
        url: '/assets/assetsField/getAssetsFieldByTableId/0',
        method: 'get',
    })
}

