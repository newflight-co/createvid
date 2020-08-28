<template>
  <q-layout view="hhh lpr fff">

    <q-header bordered class="bg-primary text-primary">
      <div class="container">
        <q-toolbar>
          <q-toolbar-title class="q-pa-sm">
            <router-link class="link text-white text-weight-light" to="/"><img style="height: 20px;" class="q-mr-sm" src="/statics/createvid.png"/>createvid.io</router-link>
          </q-toolbar-title>
          <q-btn class="float-right"
                 flat
                 round
                 icon="account_circle"
                 color="white"
                 to="/account"
          />
        </q-toolbar>
      </div>
    </q-header>

    <q-page-container class="q-pb-xl">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>

export default {
  name: 'Layout',
  meta: {
    title: 'CreateVidio',
    titleTemplate: title => `${title} - CreateVidio`
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="stylus">
.container, .q-page-container {
    margin: auto;
    max-width: 1200px;
}
</style>
