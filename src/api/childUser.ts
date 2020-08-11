import request from '@/utils/request'

export function departmentList(query: any) {
  return request({
    url: '/uc/v1/user/list',
    method: 'get',
    params: query
  })
}