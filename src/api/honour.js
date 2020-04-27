import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/honour/list',
    method: 'get',
    params: query
  })
}

export function fetchHonour(id) {
  return request({
    url: '/honour/detail',
    method: 'get',
    params: { id }
  })
}

export function createHonour(data) {
  return request({
    url: '/honour/create',
    method: 'post',
    data
  })
}
