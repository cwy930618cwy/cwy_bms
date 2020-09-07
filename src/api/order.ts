import request from "@/utils/request";

// 分页查询订单列表
export function postOrderList(data: any) {
  return request({
    url: "/msb-ppf/order/sysPayOrder/list",
    method: "post",
    data
  });
}

// 分页查询订单列表
export function getOrderList(data: any) {
  return request({
    url: "/msb-ppf/order/sysPayOrder/detail",
    method: "get",
    params: data
  });
}

// 删除支付订单
export function postOrderDelete(data: any) {
  return request({
    url: "/msb-ppf/order/sysPayOrder/delete",
    method: "post",
    params: data
  });
}
