import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/review/vote/list',
    method: 'get',
    params: query
  })
}

export function fetchVote(id) {
  return request({
    url: '/review/vote/detail',
    method: 'get',
    params: { id }
  })
}

export function createVote(data) {
  return request({
    url: '/review/vote/create',
    method: 'post',
    data
  })
}

export function updateVote(data) {
  return request({
    url: '/review/vote/update',
    method: 'post',
    data
  })
}
