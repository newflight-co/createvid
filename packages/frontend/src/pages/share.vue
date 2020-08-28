<template>
  <q-page>
    <div class="q-px-md">
      <div class="row">
        <PageTitle :title="video.title"/>
        <PageActions :cancel="loggedIn"/>
      </div>
      <div class="row q-mb-xl">
        <div class="col-12">
          <q-card bordered class="shadow-24">

            <div class="video-container">

              <videoPlayer
                v-if="video.url"
                autoPlay
                controls
                :mouseOver="false"
                :poster="video.poster"
                :source="video.url"
              />
            </div>
          </q-card>
        </div>
        <!-- <div class="col-4 q-px-xl">
          <div class="text-h5">Hello,</div>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
          commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
          eveniet doloribus ullam aliquid.</p>
          <q-btn outline class="full-width no-shadow q-mt-lg" color="primary" size="md" label="Book a meeting" />
        </div> -->
      </div>
    </div>
  </q-page>
</template>

<style lang="stylus" scoped>
.video-container {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>

<script>
import axios from 'axios'

import PageTitle from 'components/page-title.vue'
import PageActions from 'components/page-actions.vue'
import VideoPlayer from 'components/video-player.vue'

export default {
  name: 'PageShare',
  meta () {
    return {
      title: this.video.title
    }
  },
  components: {
    PageTitle,
    PageActions,
    VideoPlayer
  },
  data () {
    return {
      loggedIn: true,
      video: {}
    }
  },
  mounted () {
    this.loadVideo()
  },
  computed: {
    videoId () {
      return this.$route.params.videoid
    }
  },
  methods: {
    async loadVideo () {
      await axios({
        method: 'GET',
        url: '/api/share/' + this.videoId
      }).then((res) => {
        this.video = res.data
      })
    }
  }
}
</script>
