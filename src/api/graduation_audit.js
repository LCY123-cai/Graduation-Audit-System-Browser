import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/review/audit/list',
    method: 'get',
    params: query
  })
}

export function fetchResultList(query) {
  return request({
    url: '/review/audit/result',
    method: 'get',
    params: query
  })
}

export function fetchPv(pv) {
  return request({
    url: '/review/audit/pv',
    method: 'get',
    params: { pv }
  })
}