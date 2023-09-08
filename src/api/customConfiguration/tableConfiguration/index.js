import request from '@/router/axios'

// 分页查询所有table
export function getAssetsTableByPage(query) {
    return request({
        url: '/assets/assetsTable/getAssetsTableByPage',
        method: 'get',
        params: query
    })
}

// 查询所有table
export function getAssetsTable() {
    return request({
        url: '/assets/assetsTable/getAssetsTable',
        method: 'get',
    })
}


// 新增配置table(超管按钮)
export function addObj(obj) {
    return request({
        url: '/assets/assetsTable/add',
        method: 'post',
        data: obj
    })
}

// 修改配置table
export function putObj (obj) {
    return request({
        url: '/assets/assetsTable/updateTable',
        method: 'put',
        data: obj
    })
}

// 通过主键查询table
export function getTableById(fieldId) {
    return request({
        url: `/assets/assetsTable/getTableById/${fieldId}`,
        method: 'get',
    })
}

// 通过tableName查询table
export function getTableByName(tableName) {
    return request({
        url: `/assets/assetsTable/getTableByName?tableName=${tableName}`,
        method: 'get',
    })
}

// 通过tableName查询资产表格/表单配置
export function getAssetsFieldByTableName(tableName) {
    return request({
        url: `/assets/assetsField/getAssetsFieldByTableName?tableName=${tableName}`,
        method: 'get',
    })
}