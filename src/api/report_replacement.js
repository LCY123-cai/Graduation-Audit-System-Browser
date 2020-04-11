import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/review/replacement/report/list',
    method: 'get',
    params: query
  })
}

export function fetchReport(id) {
  return request({
    url: '/review/replacement/report/detail',
    method: 'get',
    params: { id }
  })
}

export function createReport(data) {
  return request({
    url: '/review/replacement/report/create',
    method: 'post',
    data
  })
}

export function fetchPv(pv) {
  return request({
    url: '/review/replacement/report/pv',
    method: 'get',
    params: { pv }
  })
}
