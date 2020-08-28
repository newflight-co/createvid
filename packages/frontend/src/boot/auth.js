import AuthService from '../services/auth.service'

export default async ({ Vue }) => {
  Vue.prototype.$auth = AuthService.create()
}
