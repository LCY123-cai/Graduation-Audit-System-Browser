import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/training/list',
    method: 'get',
    params: query
  })
}

export function importData(data) {
  return request({
    url: '/training/import',
    method: 'post',
    data
  })
}
