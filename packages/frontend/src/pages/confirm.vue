<template>
  <q-page>
    <div class="q-px-md">
      <div class="row">
        <PageTitle title="Confirm Video Render"/>
        <PageActions cancel/>
      </div>
      <div class="row">
        <q-card>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style lang="stylus" scoped>
</style>

<script>
import PageTitle from 'components/page-title.vue'
import PageActions from 'components/page-actions.vue'

export default {
  name: 'PageConfirm',
  components: {
    PageTitle,
    PageActions
  },
  data () {
    return {
    }
  }
}
</script>
