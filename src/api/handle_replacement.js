import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/replacement/list',
    method: 'get',
    params: query
  })
}

export function createReplacement(data) {
  return request({
    url: '/replacement/create',
    method: 'post',
    data
  })
}

export function updateReplacement(data) {
  return request({
    url: '/replacement/update',
    method: 'post',
    data
  })
}

