import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../components/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/index',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import(/* webpackChunkName: "about" */ '../components/Index.vue'),
      },
      {
        path: '/users',
        name: 'Users',
        component: () => import(/* webpackChunkName: "about" */ '../views/Users.vue'),
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import(/* webpackChunkName: "about" */ '../views/Roles.vue'),
      },
      {
        path: '/rights',
        name: 'Rights',
        component: () => import(/* webpackChunkName: "about" */ '../views/Rights.vue'),
      },
      {
        path: '/goods',
        name: 'Goods',
        component: () => import(/* webpackChunkName: "about" */ '../views/Goods.vue'),
      },
      {
        path: '/goods/add',
        name: 'Add',
        component: () => import(/* webpackChunkName: "about" */ '../views/Add.vue'),
      },
      {
        path: '/params',
        name: 'Params',
        component: () => import(/* webpackChunkName: "about" */ '../views/Params.vue'),
      },
      {
        path: '/categories',
        name: 'Categories',
        component: () => import(/* webpackChunkName: "about" */ '../views/Categories.vue'),
      },
      {
        path: '/orders',
        name: 'Orders',
        component: () => import(/* webpackChunkName: "about" */ '../views/Orders.vue'),
      },
      {
        path: '/reports',
        name: 'Reports',
        component: () => import(/* webpackChunkName: "about" */ '../views/Reports.vue'),
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  if (sessionStorage.getItem('token')) {
    next()
  } else {
    next({ path: '/login', query: { redirect: to.fullPath }})
  }
})

export default router
