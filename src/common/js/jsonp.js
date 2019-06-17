import ProJsonp from 'jsonp'
/******
 *  @param string url 请求接口的url,
 *  @param object 配置jsonp的参数,
 *  @param data   请求参数的函数
 * ***** */
export function jsonp (url, data, opts) {
  url += url.indexOf('?') > -1 ? '&' : '?' + param(data)
  return new Promise((resolve, reject) => {
    ProJsonp(url, opts, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param (data) {
  let url = ''
  for (const key in data) {
    let value = data[key] !== undefined ? data[key] : ''
    url += `&${key}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
