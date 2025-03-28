export function isDev() {
    return process.env.NODE_ENV === 'development'

}

export function isTest() {
    return process.env.NODE_ENV === 'test'

}

export const workFlowUrl = !isDev() ? !isTest() ? `https://global.idatatrust.com/dtrust-console` : 'http://116.205.172.167:38888' : `http://${window.location.hostname}:38888`

export const adminUrl = !isDev() ? !isTest() ? `https://global.idatatrust.com/dtrust-admin` : 'http://116.205.172.167:38081' : `http://${window.location.hostname}:38081`

export const assetsUrl = !isDev() ? !isTest() ? `https://global.idatatrust.com/dtrust-assets` : 'http://116.205.172.167:38082' : `http://${window.location.hostname}:38082`

export const estimateUrl = !isDev() ? !isTest() ? `https://global.idatatrust.com/dtrust-assessment` : 'http://116.205.172.167:38080' : `http://${window.location.hostname}:38080`

export const powerUrl = !isDev() ? !isTest() ? `https://global.idatatrust.com/dtrust-power` : 'http://116.205.172.167:38083' : `http://${window.location.hostname}:38083`
  