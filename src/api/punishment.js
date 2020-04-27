import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/punishment/list',
    method: 'get',
    params: query
  })
}

export function createPunishment(data) {
  return request({
    url: '/punishment/create',
    method: 'post',
    data
  })
}
