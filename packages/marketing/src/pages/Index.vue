<template>
  <q-page>
    <div class="container header">
      <div class="row headline text-left full-width q-mt-xl">
        <div class="col-md-7">
          <div class="row">
            <div class="col">
              <h2 class="text-accent">{{ appData.headline }}</h2>
              <p>{{ appData.subHeadline }}</p>
            </div>
          </div>
        </div>
        <div class="header-image" :style="{ backgroundImage: `url('${appData.headerImageUrl}')`,   maskImage: `url('${appData.headerMaskUrl}')`}"></div>
      </div>
      <div class="row" id="signup">
        <div class="signup col-md-7 col-12 q-py-md q-px-lg q-mb-xl bg-white text-primary">
          <div class="row">
            <div class="col-md-8 col-7">
                <q-input type="email"
                          v-model="email"
                          :placeholder="$q.platform.is.mobile ? 'Enter email' : 'Enter your email to be notified when we launch.'"
                          class="full-width no-shadow q-pa-none"
                          color="primary"
                          borderless
                          hide-bottom-space
                          :error="emailSuccess === 'invalid'"
                          @input="emailSuccess = 'typing'"
                          @keyup.enter="submitEmail()"
                >
                  <template v-slot:error>
                    <span v-if="emailSuccess === 'error'">Sorry something went wrong, please try again.</span>
                    <span v-if="emailSuccess === 'invalid'">That email doesn't look right, please try again.</span>
                  </template>
                </q-input>
            </div>
            <div class="col-md-3 col-5 offset-md-1">
              <q-btn :label="emailSent ? 'Subscribed' : appData.ctaBtn"
                     @click="submitEmail()"
                     :color="emailSent ? 'positive' : 'primary'"
                     :disable="emailSent"
                     :loading="emailSuccess === 'sending'"
                     class="full-width q-mt-sm"
                     outline
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="content call-out bg-primary q-pa-xl shadow-10">
        <div class="row text-center">
          <div class="col">
            <h5 class="text-white q-mt-md">{{ appData.overviewHeading }}</h5>
          </div>
        </div>
        <div class="row text-center text-light">
          <div class="col-10 offset-1 q-pb-lg">
            <p style="font-size: 1.2em">{{ appData.overview }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="content container">
      <div class="row text-center">
        <div class="col">
          <h5 class="text-accent">{{ appData.contentHeadline }}</h5>
        </div>
      </div>
      <div class="row q-mb-xl">
        <div class="col text-center">
          <div class="row q-gutter-xl features text-left">
            <div v-for="(feature, index) in appData.features" :key="index" class="col-md q-pa-xl bg-white rounded-borders">
              <div class="bg-grey-2 icon-container q-mb-md">
                <q-icon v-if="feature.icon.type === 'icon'" :name="feature.icon.name" class="text-primary q-mb-sm"/>
              </div>
              <strong class="text-primary">{{ feature.title }}</strong>
              <p class="text-faded q-mt-md">{{ feature.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row text-center">
        <div class="col">
          <h5 class="q-mb-lg text-accent">{{ appData.cta }}</h5>
          <q-btn rounded color="primary" :label="appData.ctaBtn" to="#signup" />
        </div>
      </div>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style="display: block;">
      <path fill="#6f46a7" fill-opacity="1" d="M0,192L120,208C240,224,480,256,720,245.3C960,235,1200,181,1320,154.7L1440,128L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
    </svg>
    <div class="footer bg-primary text-light">
      <div class="container">
        <div class="row q-py-xl">
          <div class="col">
            {{ appData.footerCopy }} &copy; {{ new Date().getFullYear() }}.
          </div>
        </div>
      </div>
    </div>
    <div class="bkg-container desktop-only" :style="{backgroundImage: `url('${appData.headerBkgUrl}')`}"/>
  </q-page>
</template>

<style lang="stylus" scoped>

  .bkg-container {
    width: 100%;
    height: 1500px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -5;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 40%;
  }

  .header .headline {
    padding-top: 50px;
    padding-bottom: 50px;
    position: relative;

    .header-image {
      position: absolute;
      width: 650px;
      height: 1150px;
      left: 600px;
      top: -300px;
      border-radius: 5px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      mask-position: center;
      mask-size: cover;
    }

    h2 {
     font-size: 4.5em;
     line-height: 1.1em;
     font-weight: 600;
    }

    p {
      font-size: 1.2em;
      margin: 0;
    }
  }

  .signup {
    border-radius: 5px;
  }

  .content {
    margin-top: 100px;

    &.call-out {
      border-radius: 5px;
    }

    .features {
      strong {
        font-size: 1.4em;
        font-weight: 400;
      }
      .icon-container {
        border-radius: 50%;
        width: 5em;
        height: 5em;
        text-align: center;
        padding: 1em;

        .q-icon {
          font-size: 3em;
        }
      }
    }
  }
</style>

<script>
import axios from 'axios'
import qs from 'qs'
import { required, email } from 'vuelidate/lib/validators'

export default {
  name: 'PageIndex',
  props: {
    appData: {
      type: Object,
      required: true
    }
  },
  meta () {
    return {
      title: this.appData.title
    }
  },
  data () {
    return {
      email: '',
      emailSuccess: undefined,
      emailSent: false
    }
  },
  validations: {
    email: { required, email }
  },
  methods: {
    submitEmail () {
      if (this.$v.email.$invalid) {
        this.emailSuccess = 'invalid'
      } else {
        this.emailSuccess = 'sending'
        const submitURL = this.appData.emailWebHook
        let data = qs.stringify({ 'querystring__email': this.email })

        axios
          .post(submitURL, data, {
            headers: {
              'content-type': 'application/x-www-form-urlencoded'
            }
          })
          .then(() => {
            this.emailSuccess = 'success'
            this.emailSent = true
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error)
            this.emailSuccess = 'error'
          })
      }
    }
  }
}
</script>
