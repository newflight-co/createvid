<template>
  <q-page>
    <div class="q-px-md">
      <div class="row">
        <PageTitle title="Create New"/>
        <PageActions cancel text="Create" @btn-click="submitForm()" :isDisabled="!allValidated" :loading="uploading"/>
      </div>
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-7 q-mt-lg q-mt-md-none">

          <q-tabs
            v-model="tab"
            align="justify"
            class="bg-white text-primary gt-sm"
          >
            <q-tab name="individual" label="Individual" />
            <q-tab name="list" label="Upload List" />
          </q-tabs>

          <q-tab-panels
            v-model="tab"
            animated
          >
            <q-tab-panel name="individual">
              <VideoCardList
                :videos="videos"
                :template="template"
                @assetClick="goToVideoTime($event.timecode)"
                v-if="template"
              />
            </q-tab-panel>

            <q-tab-panel name="list">
              <csvUploadStepper :template="template"/>
            </q-tab-panel>

          </q-tab-panels>
        </div>

        <div class="col-5 gt-sm" v-if="template">
          <div class="row q-mb-sm">
            <div class="col">
              <strong>Preview</strong>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <div class="videoContainer">
                <videoPlayer
                  ref="videoPreview"
                  :poster="template.poster"
                  :source="template.url"
                  :controls="false"
                  :paused="true"
                  :muted="true"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </q-page>
</template>

<style>
</style>

<script>
import api from '../services/api.service'

import { mapActions } from 'vuex'
import PageTitle from 'components/page-title.vue'
import PageActions from 'components/page-actions.vue'
import VideoPlayer from 'components/video-player.vue'
import csvUploadStepper from 'components/new/csv-upload-stepper.vue'

import VideoCardList from '../components/new/video-card-list.vue'

import { setTimeout } from 'timers'

export default {
  name: 'PageCreateNew',
  meta () {
    return {
      title: 'Create New'
    }
  },
  components: {
    PageTitle,
    PageActions,
    VideoPlayer,
    csvUploadStepper,
    VideoCardList
  },
  beforeMount () {
    this.loadTemplates()
  },
  computed: {
    template () {
      return this.$store.getters['templates/getTemplateById'](this.templateID)
    }
  },
  mounted () {
    this.$root.$on('videoValid', this.updateValidated)
    this.$root.$on('previewChapter', this.previewChapter)
  },
  data () {
    return {
      tab: 'individual',
      uploading: false,
      focus: 0,
      templateID: this.$route.params.templateid,
      videos: [
        {}
      ],
      uploadList: false,
      validatedVideos: [],
      allValidated: false
    }
  },
  methods: {
    async submitForm (e) {
      try {
        this.uploading = true
        await Promise.all(this.videos.map(video => api.createTask(this.template.id, video)))
        await this.$router.push('/library/' + this.templateID)
      } catch (err) {
        this.uploading = false
      }
    },
    ...mapActions('templates', [
      'loadTemplates'
    ]),
    previewChapter (time) {
      this.$refs.videoPreview.goToTime(time)
      this.$refs.videoPreview.playPause()
      setTimeout(() => {
        this.$refs.videoPreview.playPause()
      }, 1500)
    },
    updateValidated (event) {
      let videosCount = this.videos.length
      let validatedCount = 0

      if (event.errors === false) {
        this.validatedVideos[event.index] = 'validated'
      } else {
        this.validatedVideos[event.index] = 'invalid'
      }

      this.validatedVideos.forEach(video => {
        if (video === 'validated') {
          validatedCount++
        }
      })

      videosCount === validatedCount ? this.allValidated = true : this.allValidated = false
    }
  },
  destroyed () {
    this.$root.$off('videoValid', this.updateValidated)
    this.$root.$off('previewChapter', this.previewChapter)
  }
}
</script>
<style lang="stylus" scoped>
.csv-button-wrapper {
  display: flex;
  width: 100%;
  padding: 0px 20pxl
  justify-content: flex-end;
}
</style>
