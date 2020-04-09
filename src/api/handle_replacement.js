import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/review/replacement/handle/list',
    method: 'get',
    params: query
  })
}

export function fetchHandle(id) {
  return request({
    url: '/review/replacement/handle/detail',
    method: 'get',
    params: { id }
  })
}

export function createHandle(data) {
  return request({
    url: '/review/replacement/handle/create',
    method: 'post',
    data
  })
}

export function updateHandle(data) {
  return request({
    url: '/review/replacement/handle/update',
    method: 'post',
    data
  })
}
