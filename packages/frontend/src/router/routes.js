import { anonymousUser, authorizationUser } from '../helpers/navigationGuards'

const routes = [
  {
    path: '/',
    component: () => import('layouts/default.vue'),
    beforeEnter: authorizationUser,
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/library/:templateid', component: () => import('pages/library.vue') },
      { path: '/new/:templateid', component: () => import('pages/new.vue') },
      { path: '/confirm', component: () => import('pages/confirm.vue') },
      { path: '/account', component: () => import('pages/account.vue') },
      { path: '/user-admin', component: () => import('pages/userAdmin.vue') }
    ]
  },
  {
    path: '/share',
    component: () => import('layouts/public.vue'),
    children: [
      { path: ':videoid', component: () => import('pages/share.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/public.vue'),
    beforeEnter: anonymousUser,
    children: [
      {
        path: '/login/:token',
        component: () => import('pages/loginCallback.vue')
      },
      { path: '/', component: () => import('pages/login.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
