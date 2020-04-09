import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/review/punishment/list',
    method: 'get',
    params: query
  })
}

export function fetchPunishment(id) {
  return request({
    url: '/review/punishment/detail',
    method: 'get',
    params: { id }
  })
}

export function createPunishment(data) {
  return request({
    url: '/review/punishment/create',
    method: 'post',
    data
  })
}
