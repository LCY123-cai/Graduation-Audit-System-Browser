import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/audit/list',
    method: 'get',
    params: query
  })
}

export function doAudit() {
  return request({
    url: '/audit/doaudit',
    method: 'get',
  })
}
