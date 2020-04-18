import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/replacement/list',
    method: 'get',
    params: query
  })
}

export function fetchHandle(id) {
  return request({
    url: '/replacement/detail',
    method: 'get',
    params: { id }
  })
}

export function createHandle(data) {
  return request({
    url: '/replacement/create',
    method: 'post',
    data
  })
}

export function updateHandle(data) {
  return request({
    url: '/replacement/update',
    method: 'post',
    data
  })
}

export function fetchPv(id) {
  return request({
    url: '/replacement/pv',
    method: 'get',
    params: { id }
  })
}
