import request from '@/utils/request'


export function fetchList(query) {
  return request({
    url: '/student/list',
    method: 'get',
    params: query
  })
}

export function createStudent(data) {
  return request({
    url: '/student/create',
    method: 'post',
    data
  })
}

export function getStudent() {
  return request({
    url: '/student/get',
    method: 'get'
  })
}
