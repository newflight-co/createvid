<template>
  <q-page>
    <div class="q-px-md">
      <div class="row">
        <PageTitle title="Templates"/>
      </div>
      <div class="row q-col-gutter-lg">
        <div v-for="(template, index) in templates" :key="index" class="col-12 col-sm-6 col-md-4">
          <q-card flat bordered @click="goTo(template.count === 0 ? '/new/' + template.id : '/library/' + template.id)">
            <img :src="template.poster" />

            <q-card-section class="q-pa-md">
              <div class="row">
                <div class="col" style="min-height: 45px;">
                  <router-link class="link" :to="template.count === 0 ? '/new/' + template.id : '/library/' + template.id">
                    <strong class="text-primary">{{template.title}}</strong>
                    <p class="q-ma-none" v-if="template.count > 0">{{ template.count }} videos</p>
                  </router-link>
                </div>
                <div class="col">
                  <q-btn class="float-right q-mx-xs no-shadow" :to="'/new/' + template.id" color="primary" size="sm">Create New</q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style lang="stylus" scoped>
</style>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import PageTitle from 'components/page-title.vue'

export default {
  name: 'PageIndex',
  components: {
    PageTitle
  },
  meta () {
    return {
      title: 'Templates'
    }
  },
  data () {
    return {}
  },
  mounted () {
    this.loadTemplates()
  },
  computed: {
    ...mapState('templates', {
      templates: 'templates'
    })
  },
  methods: {
    ...mapActions('templates', [
      'loadTemplates'
    ]),
    ...mapGetters('templates', {
      countVideos: 'countVideos'
    }),
    goTo (page) {
      this.$router.push(page)
    }
  }
}
</script>
