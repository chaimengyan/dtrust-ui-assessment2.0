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