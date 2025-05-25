import request from '@/router/axios'

export function adminApi() {
    return {
        getAllMenuApi() {
            return request({
                url: '/admin/menu',
                params: {
                    parentId: -1,
                },
                method: 'get'
            })
          },
        // 上传文件
        fileUploadApi: (data) => {
            return request({
                url: '/admin/file/fileUpload',
                method: 'post',
                data,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        },
        // 查询当前用户信息
		getUserInfoApi: () => {
			return request({
				url: '/admin/user/info',
                method: 'get'
			})
		},
        // 查询所有用户信息
		getUserListApi: () => {
			return request({
				url: '/admin/user/getList',
				method: 'get',
			})
		},
        // 获取上级部门
        getParentsDeptApi: (deptId) =>{
            return request({
                url: `/admin/dept/getParentsDept?deptId=${deptId}`,
                method: 'get',
            })
        },
        // 获取该部门下所有用户
        getUserListByDeptIdApi: (deptId) =>{
            return request({
                url: `/admin/user/getUserListByDeptId?deptId=${deptId}`,
                method: 'get',
            })
        },
          // 获取多个部门下所有用户
          getUserListByDeptIdsApi: (deptIds) =>{
            return request({
                url: `/admin/user/getUserListByDeptIds?deptIds=${deptIds}`,
                method: 'get',
            })
        },
        // 获取真实路径
        getFileRealPathApi: (path) =>{
            return request({
                url: `/admin/file/downLoadFile?path=${path}`,
                method: 'get',
            })
        },
         // 获取logo
         getUserLogoApi: () =>{
            return request({
                url: `/admin/tenant/logo`,
                method: 'get',
            })
        },
         // 获取logo
         checkAuthorityApi: (params) =>{
            return request({
                url: `/admin/user/checkAuthority?userId=${params.userId}&deptId=${params.deptId}`,
                method: 'get',
            })
        },
        // 获取租户信息
        getTenantByIdApi: (tenantId) =>{
            return request({
                url: `/admin/tenant/getTenantById?tenantId=${tenantId}`,
                method: 'get',
            })
        },
        // 修改用户信息
        updateByUserApi: (params) =>{
            return request({
                url: `/admin/user/updateByUser`,
                method: 'put',
                data: params
            })
        },
        // 获取部门信息
        getDeptTreeByTenantIdApi: (tenantId) =>{
            return request({
                url: `/admin/dept/getDeptTreeByTenantId?tenantId=${tenantId}`,
                method: 'get',
            })
        },
        // 获取部门信息
        getDeptTree: () =>{
            return request({
                url: `admin/dept/tree`,
                method: 'get',
            })
        },
        // 获取角色信息
        getRoleListApi: () =>{
            return request({
                url: `/admin/role/list`,
                method: 'get',
            })
        },

        // 根据id获取角色信息
        getRoleListByIdsApi: (ids) =>{
            return request({
                url: `/admin/role/listByIds?ids=${ids}`,
                method: 'get',
            })
        },

        // 分页查询通知
        getNoticePageApi: (params) => {
            return request({
            url: `/admin/notice/page`,
            method: 'get',
            params
            })
        },
        // 批量已读
        readNoticeApi: (ids) => {
            return request({
            url: `/admin/notice/read?ids=${ids}`,
            method: 'put',
            })
        },
        // 根据id删除通知
        delNoticeApi: (id) => {
            return request({
            url: `/admin/notice/${id}`,
            method: 'delete',
            })
        },
        // AI 创建新对话
        getChatIdApi: () => {
            return request({
            url: `/intelligence/chatting/getChatId`,
            method: 'get',
            })
        },
         // AI 获取对话列表
         getChatListApi: () => {
            return request({
            url: `/intelligence/chatting/list`,
            method: 'get',
            })
        },
        // AI chat
        AIChatApi: (message, chatId) => {
            return request({
            url: `/intelligence/chatting/dialogue?chatId=${chatId}&message=${message}`,
            method: 'get',
            })
        },
        // 根据对话id获取历史聊天记录
        listByChatIdApi: (message, chatId) => {
            return request({
            url: `/intelligence/chatting/listByChatId?chatId=${chatId}`,
            method: 'get',
            })
        },
          // 处理对应功能 一键代入
        generateApi: (type, questionId, messageId) => {
            return request({
            url: `/intelligence/chatting/generate?type=${type}&questionId=${questionId}&messageId=${messageId}`,
            method: 'post',
            })
        },
        // 导出使用手册
		exportUserManualApi: () => {
			return request({
				url: `/admin/instructionManual/export`,
				method: 'get',
				responseType: 'blob'
			});
		},

        // 修改系统语言AR,EN,ES,FR,JA,KO,PT,RU,ZH_CN,ZH_TW
        changeLanguageApi: (language) => {
            return request({
            url: `/admin/user/language/${language}`,
            method: 'put',
            })
        },

    };
}