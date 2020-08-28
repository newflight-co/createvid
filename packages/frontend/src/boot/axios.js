import axios from 'axios'
import AuthService from '../services/auth.service'

export default async ({ Vue }) => {
  const accessToken = await AuthService.getAccessToken()
  Vue.prototype.$axios = axios.create({
    timeout: 10000,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
}
