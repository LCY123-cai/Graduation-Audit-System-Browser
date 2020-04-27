import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/replacement/list',
    method: 'get',
    params: query
  })
}
