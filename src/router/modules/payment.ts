/** When your routing table is too long, you can split it into small modules **/

import Layout from "@/layout/index.vue";

const paymentRouter = {
  path: "/payment",
  component: Layout,
  redirect: "/payment/order",
  name: "payment",
  meta: {
    title: "支付中台",
    icon: "table"
  },
  children: [
    {
      path: "order",
      component: () => import("@/views/payment/order/order.vue"),
      name: "order",
      meta: { title: "订单管理" }
    },
    {
      path: "apply",
      component: () => import("@/views/payment/apply/apply.vue"),
      name: "apply",
      meta: { title: "应用管理" }
    }
  ]
};
export default paymentRouter;
