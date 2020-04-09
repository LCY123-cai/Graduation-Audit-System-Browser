import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/review/honour/list',
    method: 'get',
    params: query
  })
}

export function fetchHonour(id) {
  return request({
    url: '/review/honour/detail',
    method: 'get',
    params: { id }
  })
}

export function createHonour(data) {
  return request({
    url: '/review/honour/create',
    method: 'post',
    data
  })
}
