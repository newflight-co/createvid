import AuthService from '../services/auth.service'

export const authorizationUser = (to, from, next) =>
  AuthService.isAuthenticated()
    .then(() => next())
    .catch(() => next('/login'))

export const anonymousUser = (to, from, next) =>
  AuthService.isAuthenticated()
    .then(() => next('/'))
    .catch(() => next())
