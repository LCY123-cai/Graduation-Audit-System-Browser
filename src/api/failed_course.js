import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/score/slist',
    method: 'get',
    params: query
  })
}

export function fetchFailedCourse(id) {
  return request({
    url: '/review/replacement/failed_course/detail',
    method: 'get',
    params: { id }
  })
}

export function createFailedCourse(data) {
  return request({
    url: '/review/replacement/failed_course/create',
    method: 'post',
    data
  })
}
