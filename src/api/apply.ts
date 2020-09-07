import request from "@/utils/request";

// 分页查询应用列表
export function getApplyList(data: any) {
  return request({
    url: "/msb-ppf/app/sysApplication/list",
    method: "post",
    data
  });
}

// 查询应用详情
export function getApplicationDetail(data: any) {
  return request({
    url: "/msb-ppf/app/sysApplication/detail",
    method: "get",
    params: data
  });
}

// 添加应用
export function postApplicationAdd(data: any) {
  return request({
    url: "/msb-ppf/app/sysApplication/add",
    method: "post",
    data
  });
}

// 更新应用
export function postApplicationUpdate(data: any) {
  return request({
    url: "/msb-ppf/app/sysApplication/update",
    method: "post",
    data
  });
}

// 删除应用
export function postApplicationDelete(data: any) {
  return request({
    url: "/msb-ppf/app/sysApplication/delete",
    method: "post",
    data
  });
}
