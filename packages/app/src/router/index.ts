import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location: any) {
   return (originalPush.call(this, location) as any).catch((err: any) => err)
}

const router = new Router({ routes })

export default router