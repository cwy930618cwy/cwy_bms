/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout/index.vue";

const tableRouter = {
  path: "/user",
  component: Layout,
  redirect: "/user/department",
  name: "user",
  meta: {
    title: "用户",
    icon: "table"
  },
  children: [
    {
      path: "department",
      component: () => import("@/views/user/department/department.vue"),
      name: "department",
      meta: { title: "部门管理" }
    },
    {
      path: "childUser",
      component: () => import("@/views/user/childUser/childUser.vue"),
      name: "childUser",
      meta: { title: "用户管理" }
    },
    {
      path: "childSystem",
      component: () => import("@/views/user/childSystem/childSystem.vue"),
      name: "childSystem",
      meta: { title: "子系统管理" }
    },
    {
      path: "character",
      component: () => import("@/views/user/character/character.vue"),
      name: "character",
      meta: { title: "角色管理" }
    },
    {
      path: "limits",
      component: () => import("@/views/user/limits/limits.vue"),
      name: "limits",
      meta: { title: "权限管理" }
    }
  ]
};
export default tableRouter;
