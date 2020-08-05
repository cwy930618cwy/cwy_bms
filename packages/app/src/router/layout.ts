import { RouteConfig } from 'vue-router'
import Layout from '@/views/layout/Layout.vue'

import Dashboard from '@/views/dashboard/index.vue'
import Page1 from '@/views/pages/page1/page1.vue'
import Page2 from '@/views/pages/page2/page2.vue'


export default [{
  path: '/dashboard',
  name: 'dashboard',
  component: Layout,
  children: [
    {
      path: '/dashboard',
      component: Dashboard,
      meta: {
        title: 'dashboard'
      }
    },
    {
      path: '/page1',
      name: 'page1',
      component: Page1,
      meta: {
        title: 'page1'
      }
    },
    {
      path: '/page2',
      name: 'page2',
      component: Page2,
      meta: {
        title: 'page2'
      }
    }
  ]
}] as RouteConfig[]
