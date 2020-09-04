import request from "@/utils/request";

// 分页查询角色列表
export function getPermissionList(data: any) {
  return request({
    url: "/uc/ucPermission/list",
    method: "post",
    data
  });
}

// 查询角色详情
export function getPermissionDetail(query: any) {
  return request({
    url: "/uc/ucPermission/detail",
    method: "get",
    params: query
  });
}

// 添加角色
export function postPermissionAdd(data: any) {
  return request({
    url: "/uc/ucPermission/doSave",
    method: "post",
    data
  });
}

// 更新角色
export function postPermissionUpdate(data: any) {
  return request({
    url: "/uc/ucPermission/update",
    method: "post",
    data
  });
}

// 批量删除角色
export function postPermissionDelete(data: any) {
  return request({
    url: "/uc/ucPermission/deleteList",
    method: "post",
    data
  });
}

// 批量删除角色
export function getSelectPermissionTreeBySubSysId(data: any) {
  return request({
    url: "/uc/ucPermission/selectPermissionTreeBySubSysId",
    method: "get",
    params: data
  });
}

// 启用权限
export function postDoEnable(data: any) {
  return request({
    url: "/uc/ucPermission/doEnable",
    method: "post",
    data
  });
}

// 禁用权限
export function postDoDeactivate(data: any) {
  return request({
    url: "/uc/ucPermission/deactivate",
    method: "post",
    data
  });
}
