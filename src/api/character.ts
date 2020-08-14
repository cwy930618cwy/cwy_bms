import request from '@/utils/request'


// 分页查询角色列表
export function getRoleList(data: any) {
  return request({
    url: '/uc/ucRole/list',
    method: 'post',
    data
  })
}

// 查询角色详情
export function getRoleDetail(query: any) {
  return request({
    url: '/uc/ucRole/detail',
    method: 'get',
    params: query
  })
}


// 添加角色
export function postRoleAdd(data: any) {
  return request({
    url: '/uc/ucRole/addUcRoleToSubSys',
    method: 'post',
    data
  })
}

// 更新角色
export function postRoleUpdate(data: any) {
  return request({
    url: '/uc/ucRole/update',
    method: 'post',
    data
  })
}

// 批量删除角色
export function postRoleDelete(data: any) {
  return request({
    url: '/uc/ucRole/doDelete',
    method: 'post',
    data
  })
}

// 分配部门系统管理员-查询系统列表
export function getSelectSysAdminListByCurrentUser() {
  return request({
    url: '/uc/ucSubSystem/selectSysAdminListByCurrentUser',
    method: 'get'
  })
}

// 根据角色id查询权限
export function getSelectPermissionByRoleId(query: any) {
  return request({
    url: '/uc/ucPermission/selectPermissionByRoleId',
    method: 'get',
    params: query
  })
}

// 给角色分配权限
export function getAddUcRolePermissionRelation(data: any) {
  return request({
    url: '/uc/ucRole/addUcRolePermissionRelation',
    method: 'post',
    data
  })
}

