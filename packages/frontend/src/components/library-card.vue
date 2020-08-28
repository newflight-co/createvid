<template>
  <q-card flat bordered>
    <div class="video-container" @click="$router.push(friendlyStatus === 'Complete' && '/share/' + video.id)">
        <div class="absolute-full flex flex-center column" v-if="friendlyStatus !== 'Complete'" style="z-index: 999">
            <div v-if="friendlyStatus === 'Queued' || friendlyStatus === 'Creating'" class="text-center text-white q-pa-md">
                <div v-if="friendlyStatus === 'Queued'">
                  <q-circular-progress size="3em" color="white" indeterminate />
                  <q-badge class="block q-mt-md" color="grey-10" outline>{{friendlyStatus}}</q-badge>
                </div>
                <div v-if="friendlyStatus === 'Creating'">
                  <q-circular-progress class="animate-spin" size="3em" color="primary" track-color="grey-1" :value="getProgress()"/>
                  <q-badge class="block q-mt-md" color="primary">{{friendlyStatus}}</q-badge>
                </div>
            </div>
            <div v-if="friendlyStatus === 'Error'" class="error text-center text-white q-pa-md">
                <q-icon name="error" color="negative" size="3em"/>
                <p class="q-mt-md">An error occured, please contact your account manager for more information or <a @click="$emit('restart', video.id)">retry</a>.</p>
            </div>
        </div>

        <div class="videoContainer" v-if="friendlyStatus === 'Complete'" @mouseenter="$refs.videoPreview.playPause()" @mouseleave="$refs.videoPreview.playPause()">
          <videoPlayer
              ref="videoPreview"
              :poster="video.poster"
              :source="video.url"
              muted
          />
        </div>
        <div v-else style="padding-top: 56.25%;"/>
    </div>

    <q-card-section>
        <div class="row">
            <div class="col">
                <strong>{{video.title}}</strong>
            </div>
        <div class="col">
            <q-btn class="float-right" @click="$emit('delete', video.id)" flat round icon="delete_outline" color="negative" size="sm">
                <q-tooltip>
                    Delete
                </q-tooltip>
            </q-btn>
            <div v-if="friendlyStatus === 'Complete'" class="float-right">
                <q-btn :to="'/share/' + video.id" color="primary" size="sm" flat round icon="share">
                <q-tooltip>
                    Share
                </q-tooltip>
                </q-btn>
                <q-btn type="a" target="_blank" :href="this.downloadUrl" color="primary" size="sm" flat round icon="cloud_download" class="gt-sm">
                <q-tooltip>
                    Download
                </q-tooltip>
                </q-btn>
            </div>
          </div>
        </div>
        </q-card-section>
    </q-card>
</template>

<script>
import videoPlayer from 'components/video-player.vue'

export default {
  name: 'Library-Card',
  components: { videoPlayer },
  props: {
    video: {
      type: Object,
      required: true
    }
  },
  computed: {
    downloadUrl () {
      return `${process.env.API_ENDPOINT}download/${this.video.id}`
    },
    friendlyStatus () {
      switch (this.video.status) {
        case 'NEW':
        case 'PREPARATION':
        case 'PREPARED': return 'Queued'
        case 'RENDER_PROCESS':
        case 'RENDER_SUCCESSFUL':
        case 'CLOUD_PROCESS': return 'Creating'
        case 'ERROR':
        case 'PREPARATION_ERROR':
        case 'RENDER_ERROR':
        case 'CLOUD_ERROR': return 'Error'
        case 'CLOUD_SUCCESSFUL':
        case 'SUCCESSFUL': return 'Complete'
        default: return 'Queued'
      }
    }
  },
  methods: {
    getProgress () {
      switch (this.video.status) {
        case 'PREPARED': return 20
        case 'RENDER_PROCESS': return 40
        case 'RENDER_SUCCESSFUL': return 80
        case 'CLOUD_PROCESS': return 90
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.video-container {
  position: relative;
  height: 100%;
  width: 100%;
  background-color: $grey-9;
}
</style>
