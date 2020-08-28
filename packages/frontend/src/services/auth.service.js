import axios from 'axios'
import { authUrls } from '../constants/urls'

export default class AuthService {
  constructor () {
    this.auth0 = null

    this.sendEmail = this.sendEmail.bind(this)
    this.login = this.login.bind(this)

    this.authResult = null
    this.logoutListeners = []
  }

  static addLogoutListener (listener) {
    this._instance.logoutListeners.push(listener)
  }

  static _instance = null;

  async _initialize () {}

  static async create () {
    if (!this._instance) {
      this._instance = new AuthService()

      await this._instance._initialize()
    }

    return this._instance
  }

  static async getUser () {
    const token = await AuthService.getAccessToken()
    if (token) {
      return JSON.parse(atob(token.split('.')[1]))
    }
    return null
  }

  static async getAccessToken () {
    let expiresDate = JSON.parse(this.expiresAt)
    if (new Date().getTime() >= expiresDate - 1000) {
      await this._instance.refresh()
    }
    return this.accessToken
  }

  static get accessToken () {
    return localStorage.getItem('access_token')
  }

  static set accessToken (value) {
    localStorage.setItem('access_token', value)
  }

  static get idToken () {
    return localStorage.getItem('id_token')
  }

  static set idToken (value) {
    localStorage.setItem('id_token', value)
  }

  static get expiresAt () {
    return localStorage.getItem('expires_at')
  }

  static set expiresAt (value) {
    localStorage.setItem('expires_at', value)
  }

  async handleAuthentication (router) {
    return AuthService.isAuthenticated()
      .then(() => router.push('/'))
      .catch(() => router.push('/login'))
  }

  setSession (authResult) {
    if (authResult == null) {
      this.logout()
      return
    }
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )
    AuthService.accessToken = authResult.accessToken
    if (authResult.idToken) {
      AuthService.idToken = authResult.idToken
    }
    AuthService.expiresAt = expiresAt
  }

  static async isAuthenticated () {
    const instance = await AuthService.create()
    await instance.refresh()

    if (!AuthService.accessToken) {
      return Promise.reject('access_denied')
    }
    return true
  }

  logout () {
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    this.logoutListeners.forEach(listener => listener())
  }

  async sendEmail (email) {
    await axios.post(authUrls.AUTH_SEND_CODE, { email })
  }

  async login (code) {
    const ret = await axios.post(authUrls.AUTH_VALIDATE_CODE, { code })
    // console.log(ret.data)
    this.authResult = ret.data
    this.setSession(this.authResult)
  }

  async refresh () {
    try {
      const ret = await axios.post(authUrls.AUTH_REFRESH, { idToken: AuthService.idToken })
      this.authResult = ret.data
      this.setSession(this.authResult)
    } catch (err) {
      // console.error(err)
      // console.log('Should now logout')
      this.setSession(null)
    }
  }
}

AuthService.create()
