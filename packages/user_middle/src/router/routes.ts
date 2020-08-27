import { RouteConfig } from 'vue-router'
import layout from './layout'

export default ([] as RouteConfig[])
  .concat(layout)
  .concat([{
    path: '*',
    redirect: '/page1'
  }])
