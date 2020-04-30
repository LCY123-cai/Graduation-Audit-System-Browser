import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/audit/list',
    method: 'get',
    params: query
  })
}

export function getDetail(studentId) {
  return request({
    url: '/audit/detail',
    method: 'get',
    params: studentId
  })
}


