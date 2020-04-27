import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/requirement/list',
    method: 'get',
    params: query
  })
}

export function fetchRequirement(id) {
  return request({
    url: '/requirement/detail',
    method: 'get',
    params: { id }
  })
}


export function createRequirement(data) {
  return request({
    url: '/requirement/create',
    method: 'post',
    data
  })
}

export function updateRequirement(data) {
  return request({
    url: '/requirement/update',
    method: 'post',
    data
  })
}

export function deleteRequirement(data) {
  return request({
    url: '/requirement/delete',
    method: 'post',
    data
  })
}
