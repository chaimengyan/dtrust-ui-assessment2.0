import request from '@/router/axios'

// 根据数据主体id查询业务场景
export function getAssetsBusinessSceneByMainBodyId(mainBodyId) {
    return request({
        url: `/assets/assetsBusinessScene/getAssetsBusinessSceneByMainBodyId/${mainBodyId}`,
        method: 'get',
    })
}

// 分页获取字段 
export function getMainBodyBySceneId(sceneId) {
    return request({
        url: `/assets/assetsSceneProjectAttributes/getMainBodyBySceneId/${sceneId}`,
        method: 'get',
    })
}

// 根据数据主体id&业务场景id查询资产
export function getAssetsProjectByMainBodyIdAndSceneId(mainBodyId, sceneId) {
    return request({
        url: `assets/assetsProject/getAssetsProjectByMainBodyIdAndSceneId/${mainBodyId}/${sceneId}`,
        method: 'get',
    })
}

// 根据数据主体id查询数据
export function getMainBodySceneData(mainBodyId) {
    return request({
        url: `/assets/assetsProjectAttributes/getMainBodySceneData/${mainBodyId}`,
        method: 'get',
    })
}
