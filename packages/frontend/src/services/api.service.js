import axios from 'axios'

import AuthService from './auth.service'

class ApiService {
  constructor () {
    AuthService.create().then(auth => {
      this.auth = auth
    })
    this.api = axios.create({
      baseURL: process.env.API_ENDPOINT,
      timeout: 10000
    })
  }

  buildFormData (video) {
    const formData = new FormData()
    Object.keys(video).forEach(key => {
      if (typeof video[key] === 'string') {
        formData.append(key, video[key])
      } else {
        formData.append(key, video[key], video[key].filename)
      }
    })
    return formData
  }

  async deleteTask (id) {
    const accessToken = await AuthService.getAccessToken()
    return this.api({
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'DELETE',
      url: '/tasks/' + id
    })
  }

  async restartTask (id) {
    const accessToken = await AuthService.getAccessToken()
    return this.api({
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'POST',
      url: '/tasks/' + id
    })
  }

  async getUsers () {
    const accessToken = await AuthService.getAccessToken()
    return this.api({
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'GET',
      url: '/users/'
    })
  }

  async createUser (email) {
    const accessToken = await AuthService.getAccessToken()
    return this.api({
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'POST',
      url: '/users/',
      data: { email }
    })
  }

  async removeUser (id) {
    const accessToken = await AuthService.getAccessToken()
    return this.api({
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'DELETE',
      url: '/users/' + id
    })
  }

  async updateUser (id, email, admin) {
    const accessToken = await AuthService.getAccessToken()
    return this.api({
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'PATCH',
      url: '/users/' + id,
      data: { email, admin }
    })
  }

  async sendWelcome (id) {
    const accessToken = await AuthService.getAccessToken()
    return this.api({
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'POST',
      url: '/users/' + id + '/welcome'
    })
  }
  async createTask (templateId, video) {
    const formData = this.buildFormData(video)
    return this.makeRequest(templateId, formData)
  }

  async apiCall ({ headers, method, url, data }) {
    const accessToken = await AuthService.getAccessToken()
    return this.api({
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`
      },
      method,
      url,
      data
    })
  }

  async makeRequest (templateId, formData) {
    const accessToken = await AuthService.getAccessToken()
    if (!accessToken) {
      return
    }
    return this.api({
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'POST',
      timeout: 60000,
      url: '/templates/' + templateId + '/tasks',
      data: formData
    })
  }
}

const api = window.api = new ApiService()

export default api
