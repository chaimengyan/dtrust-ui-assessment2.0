import request from '@/router/axios'

// 获取全部问卷 typeIds：2资产 1业务场景
export function getQuestionnaireList (query) {
    return request({
        url: '/assessment/questionnaire/getQuestionnaireList',
        method: 'get',
        params: query
    })
}

// 启动评估
export function releaseAssessQuestionnaire (query) {
    return request({
        url: '/assessment/info/releaseAssessQuestionnaire',
        method: 'put',
        data: query
    })
}

// 查询所有用户信息
export function getUserList () {
    return request({
        url: '/admin/user/getList',
        method: 'get',
    })
}