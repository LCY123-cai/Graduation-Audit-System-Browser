import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/audit/management/list',
    method: 'get',
    params: query
  })
}

export function fetchManagement(id) {
  return request({
    url: '/audit/management/detail',
    method: 'get',
    params: { id }
  })
}


export function createManagement(data) {
  return request({
    url: '/audit/management/create',
    method: 'post',
    data
  })
}

export function updateManagement(data) {
  return request({
    url: '/audit/management/update',
    method: 'post',
    data
  })
}
