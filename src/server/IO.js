import querystring from 'querystring'
const axios = require('axios')
axios.defaults.baseURL = window.location.origin
export function get (url, params) {
  return axios(url + '?' + querystring.stringify(params), {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then((res) => res.data)
}

export function post (url, data) {
  return axios(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then((res) => res.data)
}

const IO = {
  get,
  post
}
export default IO
