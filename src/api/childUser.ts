import request from '@/utils/request'

// 查询用户详情
export function getUserDetail(data: any) {
  return request({
    url: '/uc/v1/user/' + data,
    method: 'get'
  })
}

// 添加用户信息
export function postUserAdd(data: any) {
  return request({
    url: '/uc/v1/user',
    method: 'post',
    data
  })
}

// 更新用户信息
export function putUserUpdate(data: any) {
  return request({
    url: '/uc/v1/user',
    method: 'put',
    data
  })
}

// 批量删除用户信息
export function deleteUserBatch(data: any) {
  return request({
    url: '/uc/v1/user/batch',
    method: 'delete',
    data
  })
}

// 批量重置密码
export function postResetPassword(data: any) {
  return request({
    url: '/uc/v1/user/password/batch/reset',
    method: 'post',
    data
  })
}

// 给用户分配角色
export function postUserRoles(data: any) {
  return request({
    url: '/uc/v1/user/roles',
    method: 'post',
    data
  })
}

// 查询当前用户是多少个子系统的部门系统管理员
export function getSelectDeptSysAdminListByCurrentUser() {
  return request({
    url: '/uc/ucSubSystem/selectDeptSysAdminListByCurrentUser',
    method: 'get'
  })
}

// 根据系统id和用户id查询角色列表相关信息
export function getSelectRoleListByUserIdAndSysId(query: any) {
  return request({
    url: '/uc/ucRole/selectRoleListByUserIdAndSysId',
    method: 'get',
    params: query
  })
}