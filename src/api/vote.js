import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vote/list',
    method: 'get',
    params: query
  })
}

export function fetchVote(id) {
  return request({
    url: '/vote/detail',
    method: 'get',
    params: { id }
  })
}

export function createVote(data) {
  return request({
    url: '/vote/create',
    method: 'post',
    data
  })
}

export function updateVote(data) {
  return request({
    url: '/vote/update',
    method: 'post',
    data
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vote/pv',
    method: 'get',
    params: { pv }
  })
}
