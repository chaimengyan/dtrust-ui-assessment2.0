import request from '@/router/axios'
import store from '@/store'

const scope = 'server'

export const loginByUsername = (username, password, code, randomStr) => {
  const grant_type = 'password'

  return request({
    url: '/auth/oauth/token',
    headers: {
      'isToken': false,
      'Authorization': 'Basic WGluTmVuZzpYaW5OZW5n'
    },
    method: 'post',
    params: { randomStr, code, grant_type, scope },
    data: {
      "username": username,
      "password": password
    }
  })
}

export const refreshToken = refresh_token => {
  const grant_type = 'refresh_token'
  return request({
    url: '/auth/oauth/token',
    headers: {
      isToken: false,
      Authorization: 'Basic WGluTmVuZzpYaW5OZW5n'
    },
    method: 'post',
    params: {refresh_token, grant_type, scope}
  })
}

export const getUserInfo = () => {
  return request({
    url: '/admin/user/info',
    method: 'get'
  })
}

export const getUserLogo = () => {
  return request({
    url: '/admin/tenant/logo',
    method: 'get'
  })
}

export const logout = () => {
  return request({
    url: '/auth/token/logout',
    method: 'delete'
  })
}

/**
 * 校验令牌，若有效期小于半小时自动续期
 * @param refreshLock
 */
export const checkToken = (refreshLock, $store) => {
  const token = store.getters.access_token

  request({
    url: '/auth/oauth/check_token',
    headers: {
      isToken: false,
      Authorization: 'Basic WGluTmVuZzpYaW5OZW5n'
    },
    method: 'get',
    params: {token}
  }).then(response => {
    const expire = response && response.data && response.data.exp
    if (expire) {
      const expiredPeriod = expire * 1000 - new Date().getTime()
      console.log('当前token过期时间', expiredPeriod, '毫秒')
      //小于半小时自动续约
      if (expiredPeriod <= 30 * 60 * 1000) {
        if (!refreshLock) {
          refreshLock = true
          $store.dispatch('RefreshToken')
              .catch(() => {
                clearInterval(this.refreshTime)
              })
          refreshLock = false
        }
      }
    }
  }).catch(error => {
    console.error(error)
  })
}
