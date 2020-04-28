import request from "@/utils/request";

export function fetchList(query) {
  return request({
    url: '/requirement/list',
    method: 'get',
    params: query
  })
}
