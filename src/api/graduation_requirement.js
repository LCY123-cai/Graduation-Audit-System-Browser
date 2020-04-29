import request from "@/utils/request";

export function fetchList(query) {
  return request({
    url: '/requirement/list',
    method: 'get',
    params: query
  })
}

export function updateRequirement(data) {
  return request({
    url: '/requirement/update',
    method: 'post',
    data
  })
}
