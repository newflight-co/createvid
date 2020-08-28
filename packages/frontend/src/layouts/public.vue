<template>
  <q-layout view="hhh lpr fff">

    <q-page-container class="q-mb-xl">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>

export default {
  name: 'Layout',
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
