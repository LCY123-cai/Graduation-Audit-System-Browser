import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/score/list',
    method: 'get',
    params: query
  })
}

export function createScore(data) {
  return request({
    url: '/score/create',
    method: 'post',
    data
  })
}

export function getScore() {
  return request({
    url: '/score/get',
    method: 'get'
  })
}
