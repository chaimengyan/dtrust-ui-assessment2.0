import request from '@/router/axios'

// 获取导出模板列表
export function getGeneralReportPageApi(query) {
    return request({
      url: '/assessment/generalReport/page',
      method: 'get',
      params: query
    })
  }

// 获取导出模板列表
export function getGeneralReportRecordsPageApi(params) {
    return request({
        url: '/assessment/generalReport/records',
        method: 'get',
        params,
    });
}
// 导出报告
export function getExportApi(params) {
    return request({
        url: `/assessment/generalReport/export`,
        method: 'get',
        params,
        responseType: 'blob'
    });
}
// 新增导出模板
export function addGeneralReportApi(data) {
    return request({
        url: '/assessment/generalReport',
        method: 'post',
        data
    });
}
// 修改导出模板
export function putGeneralReportApi(data) {
    return request({
        url: '/assessment/generalReport',
        method: 'put',
        data
    });
}
// 删除导出模板
export function delGeneralReportApi(ids) {
    return request({
        url: `/assessment/generalReport?ids=${ids}`,
        method: 'delete',
    });
}
// 查询模板的导出记录
export function getRecordsApi(params) {
    return request({
        url: `/assessment/generalReport/records`,
        method: 'get',
        params,
    });
}
// 查询评估列表
export function getEvaluationListApi (params) {
    return request({
        url: '/assessment/evaluation/list',
        method: 'get',
        params,
    });
}