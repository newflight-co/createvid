<template>
  <q-layout view="hhh lpR fFf" :class="title.toLowerCase()">

    <q-header class="bg-white text-primary">
      <div class="container header-bar">
        <q-toolbar class="q-pa-none">
          <q-toolbar-title>
            <img class="logo" :src="'statics/' + title + '/' + title + '-inverted.png'">
          </q-toolbar-title>
        </q-toolbar>
      </div>
    </q-header>

    <q-page-container v-if="!loading">
      <router-view :appData="appData" style="z-index: 10" />
    </q-page-container>

  </q-layout>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Default',
  meta () {
    return {
      link: {
        appTheme: { rel: 'stylesheet', href: 'statics/' + this.title + '/style.css' }
      }
    }
  },
  data () {
    const APP_TITLE = process.env.APP_TITLE || 'CreateVidio'
    return {
      loading: true,
      title: APP_TITLE.toLowerCase()
    }
  },
  created () {
    const APP_TITLE = process.env.APP_TITLE || 'CreateVidio'
    let appDataUrl = '/statics/' + APP_TITLE.toLowerCase() + '/data.json'
    return axios.get(appDataUrl)
      .then(res => {
        this.appData = res.data
        this.loading = false
      })
  }
}
</script>

<style lang="stylus">

.q-page {
  overflow-x: hidden;
}

.logo {
  height: 20px;
  margin: 20px 0 12px 0;
}

.container {
  max-width: 1000px;
  margin: auto;
  z-index: 10;
  padding:30px;
}

.header-bar {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
