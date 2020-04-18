import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/replacement/list',
    method: 'get',
    params: query
  })
}

export function fetchReport(id) {
  return request({
    url: '/replacement/detail',
    method: 'get',
    params: { id }
  })
}

export function createReport(data) {
  return request({
    url: '/replacement/create',
    method: 'post',
    data
  })
}

export function fetchPv(pv) {
  return request({
    url: '/replacement/pv',
    method: 'get',
    params: { pv }
  })
}
