import request from "@/utils/request";

// 分页查询部门树
export function getDeptTree(query: any) {
  return request({
    url: "/uc/ucDept/tree",
    method: "get",
    params: query
  });
}
