<template>
  <q-page>
    <div class="q-ma-md-lg window-height">
      <div class="row window-height items-md-center justify-center">
        <div class="col-12 col-sm-6 col-md-8 q-px-md q-px-md-none q-mt-xl q-mt-md-none">
          <form @submit.prevent="sendEmail()">
            <q-card class="bg-primary shadow-20 q-pa-md q-pa-md-lg" dark>
              <q-card-section class="text-center text-white q-pa-md">
                <router-link class="logo link text-white text-weight-light" to="/"><img style="height: 20px;" class="q-mr-sm" src="/statics/createvid.png"/>createvid.io</router-link>
                <div class="full-width q-my-md">
                  Welcome to CreateVid.io. Enter your email to recieve a link to log in.
                </div>
              </q-card-section>
              <q-card-section class="text-center q-pa-lg q-mx-lg">
                <q-input v-model="email" dark placeholder="Email Address" type="email">
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>
                <q-btn
                  type="submit"
                  color="white"
                  outline
                  rounded
                  class="full-width q-mt-lg"
                  :label="status !== '' ? 'Send again' : 'Send magic link'"
                />
              </q-card-section>
              <q-card-section class="text-center q-pa-lg q-mx-lg">
                <div v-if="status === 'success'" class="status q-pa-md bg-white text-primary">
                  Email sent! Please check your inbox.
                </div>
                <div v-if="status === 'error'" class="status q-pa-md bg-info">
                  Oops. {{errorMessage}}, try again.
                </div>
              </q-card-section>
            </q-card>
          </form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style lang="stylus" scoped>
  .logo {
    font-size: 20px;
    line-height: 30px;
  }
</style>

<script>
import AuthService from '../services/auth.service'

export default {
  name: 'PageIndex',
  beforeMount: async function () {
    this.authService = await AuthService.create()
  },
  methods: {
    sendEmail () {
      this.authService.sendEmail(this.email)
      this.status = 'success'
    }
  },
  meta () {
    return {
      title: 'Login'
    }
  },
  data () {
    return {
      email: '',
      status: '',
      errorMessage: 'Email not found'
    }
  }
}
</script>
