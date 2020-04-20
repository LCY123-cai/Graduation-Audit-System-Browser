import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/score/list',
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
