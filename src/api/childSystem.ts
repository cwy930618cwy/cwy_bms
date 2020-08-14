import request from "@/utils/request";

// 分页查询子系统
export function getSystemList(data: any) {
  return request({
    url: "/uc/ucSubSystem/list",
    method: "post",
    data
  });
}

// 分页查询子系统
export function getSystemDetail(query: any) {
  return request({
    url: "/uc/ucSubSystem/detail",
    method: "get",
    params: query
  });
}

// 添加子系统
export function postSystemAdd(data: any) {
  return request({
    url: "/uc/ucSubSystem/add",
    method: "post",
    data
  });
}

// 更新子系统
export function postSystemUpdate(data: any) {
  return request({
    url: "/uc/ucSubSystem/update",
    method: "post",
    data
  });
}

// 批量删除子系统
export function postSystemDelete(data: any) {
  return request({
    url: "/uc/ucSubSystem/doDeleteList",
    method: "post",
    data
  });
}

// 确认分配系统管理员
export function postAllocationSysAdmin(data: any) {
  return request({
    url: "/uc/ucUserSystemRelation/allocationSysAdmin",
    method: "post",
    data
  });
}
