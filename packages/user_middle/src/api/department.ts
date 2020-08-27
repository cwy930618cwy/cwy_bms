import request from '@/utils/request'


// 分页查询部门树
export function getDeptTree(query: any) {
  return request({
    url: '/uc/ucDept/tree',
    method: 'get',
    params: query
  })
}

// 分页查询部门
export function postDeptList(data: any) {
  return request({
    url: '/uc/ucDept/listPage',
    method: 'post',
    data
  })
}


// 查询部门详情
export function getDeptDetail(query: any) {
  return request({
    url: '/uc/ucDept/detailDept/' + query,
    method: 'get'
  })
}

// 更新部门
export function postDeptUpdate(data: any) {
  return request({
    url: '/uc/ucDept/update',
    method: 'post',
    data
  })
}

// 添加部门
export function postDeptAdd(data: any) {
  return request({
    url: '/uc/ucDept/add',
    method: 'post',
    data
  })
}

// 批量删除部门
export function postDeptDelete(data: any) {
  return request({
    url: '/uc/ucDept/deleteList',
    method: 'post',
    data
  })
}

// 分页查询用户信息
export function postUserList(data: any) {
  // return data2
  return request({
    url: '/uc/v1/user/list',
    method: 'post',
    data
  })
}

// 查询当前用户是多少个子系统的系统管理员
export function getSelectSysAdminListByCurrentUser() {
  return request({
    url: '/uc/ucSubSystem/selectSysAdminListByCurrentUser',
    method: 'get'
  })
}

// 分配系统管理员
export function getAllocationDeptSysAdmin(data: any) {
  return request({
    url: '/uc/ucUserSystemRelation/allocationDeptSysAdmin',
    method: 'post',
    data
  })
}