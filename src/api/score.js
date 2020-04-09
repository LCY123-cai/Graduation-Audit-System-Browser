import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/review/score/list',
    method: 'get',
    params: query
  })
}

export function fetchScore(id) {
  return request({
    url: '/review/score/detail',
    method: 'get',
    params: { id }
  })
}

export function createScore(data) {
  return request({
    url: '/review/score/create',
    method: 'post',
    data
  })
}
