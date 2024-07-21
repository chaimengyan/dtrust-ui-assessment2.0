import Cookies from 'js-cookie'
import { isEmpty } from 'lodash'
import { isDev, isTest } from './env'

export default class CookieUtil {
    static defaultOptions = {
        domain: !isDev() ? 'idatatrust.com' : undefined
    }

    static set(name, value, option={}) {
        if (isEmpty(value)) {
            return Cookies.remove(name, CookieUtil.defaultOptions)
        }
        // 创建一个名称为name，对应值为value的cookie，由于没有设置失效时间，默认失效时间为该网站关闭时
        Cookies.set(name, value, Object.assign(CookieUtil.defaultOptions, option))
    }

    static get(name) {
        // 获取指定名称的cookie
        return Cookies.get(name)
    }

    static remove(name) {
        // 删除指定名称的cookie
        return Cookies.remove(name)
    }

    static setToken(val, refreshVal) {
        CookieUtil.set('access_token', val)
        CookieUtil.set('refresh_token', refreshVal)
    }
    
    static getToken() {
        return {
            access_token: CookieUtil.get('access_token'),
            refresh_token: CookieUtil.get('refresh_token'),
        }
    }

    static removeToken() {
        return {
            access_token: CookieUtil.remove('access_token'),
            refresh_token: CookieUtil.remove('refresh_token'),
        }
    }
}