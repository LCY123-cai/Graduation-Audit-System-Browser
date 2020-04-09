import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/review/requirement/list',
    method: 'get',
    params: query
  })
}

export function fetchRequirement(id) {
  return request({
    url: '/review/requirement/detail',
    method: 'get',
    params: { id }
  })
}


export function createRequirement(data) {
  return request({
    url: '/review/requirement/create',
    method: 'post',
    data
  })
}

export function updateRequirement(data) {
  return request({
    url: '/review/requirement/update',
    method: 'post',
    data
  })
}
