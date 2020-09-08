/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout/index.vue";

const tableRouter = {
  path: "/user",
  component: Layout,
  redirect: "/user/department",
  name: "user",
  meta: {
    title: "用户中台",
    icon: "table"
  },
  children: [
    {
      path: "department",
      component: () => import("@/views/user/department/department.vue"),
      name: "department",
      meta: { title: "部门管理" }
    }
  ]
};
export default tableRouter;
