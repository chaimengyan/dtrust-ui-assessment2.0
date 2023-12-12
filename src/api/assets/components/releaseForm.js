import request from '@/router/axios'

// 获取问卷列表资产1业务场景2
export function getQnListApi (params) {
    return request({
        url: '/assessment/questionnaire/list?categoryIds='+params.categoryIds,
        method: 'get',
    })
}


// 获取问卷下所有章节
export function getChapterByQnIdApi (qnId) {
    return request({
        url: `/assessment/question/getChaptersByQnId?qnId=${qnId}`,
        method: 'get',
    });
}

// 根据问卷id获取评估触发逻辑
export function getByQuestionnaireApi (qnId) {
    return request({
        url: '/assessment/prefabricate/getByQuestionnaire?qnId='+ qnId,
        method: 'get',
    });
}

// 查询所有用户信息
export function getUserList () {
    return request({
        url: '/admin/user/getList',
        method: 'get',
    })
}

// 发起评估
export function startEvaluationApi (data) {
    return request({
        url: `/assessment/evaluation/start`,
        method: 'post',
        data,
    });
}