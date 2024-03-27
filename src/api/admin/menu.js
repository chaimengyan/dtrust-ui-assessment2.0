import request from '@/router/axios'

export function getMenu(id) {
  return request({
    url: '/admin/menu/getMenuByModules',
    params: {
      parentId: id,
      modules: 'assets'
      },
    method: 'get'
  })
}

export function getAllMenu(id) {
  return request({
    url: '/admin/menu',
    params: {
      parentId: -1,
      },
    method: 'get'
  })
}

export function checkAuthority(params) {
  return request({
    url: `/admin/user/checkAuthority?userId=${params.userId}&deptId=${params.deptId}`,
    method: 'get',
  })
}

// 分页查询通知
export function getNoticePage(params) {
  return request({
    url: `/admin/notice/page`,
    method: 'get',
    params
  })
}
// 批量已读
export function readNotice(ids) {
  return request({
    url: `/admin/notice/read?ids=${ids}`,
    method: 'put',
  })
}
// 根据id删除通知
export function delNotice(id) {
  return request({
    url: `/admin/notice/${id}`,
    method: 'delete',
  })
}