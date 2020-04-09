import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/review/table/list',
    method: 'get',
    params
  })
}
