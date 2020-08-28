<script>
import AuthService from '../services/auth.service'

export default {
  name: 'PageLoggingIn',
  beforeMount: async function () {
    this.authService = await AuthService.create()
    await this.authService.login(this.$route.params.token)
    await this.authService.handleAuthentication(this.$router)
  },
  meta () {
    return {
      title: 'Logging in...'
    }
  },
  data () {
    return {
      authService: undefined
    }
  }
}
</script>
