<template>
  <div class="row q-col-gutter-lg">
    <div v-for="(video, vIndex) in videos" :key="vIndex" class="col-12">

      <VideoCard
        @remove="removeVideo(vIndex)"
        @focus="focus = vIndex"
        :showDelete="vIndex !== 0"
        :template="template"
        :video="videos[vIndex]"
        :focused="focus === vIndex"
        :index="vIndex"
      />
    </div>

    <div class="col-12">
      <q-btn class="full-width" color="primary" icon="add_circle_outline" label="Add Another" @click="addVideo" />
    </div>
  </div>
</template>

<script>
import VideoCard from './video-card/video-card'

export default {
  name: 'VideoCardList',
  components: {
    VideoCard
  },
  props: {
    template: {
      type: Object,
      required: true
    },
    videos: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      focus: 0
    }
  },
  computed: {
    titleAsset () {
      if (!this.template) return ''
      const asset = this.template.assets.find(asset => asset.titleField === true)
      return asset ? asset.layerName : ''
    }
  },
  methods: {
    addVideo () {
      this.videos.push({})
      this.focus = (this.focus + 1)
    },
    removeVideo (vIndex) {
      this.videos.splice(vIndex, 1)
      this.focus = (this.focus - 1)
      this.$root.$emit('videoValid', { errors: true, index: vIndex })
    },
    getTitle (index) {
      if (this.titleAsset !== '') {
        return this.videos[index][this.titleAsset] ? this.videos[index][this.titleAsset] : 'Video ' + (index + 1)
      } else {
        return 'Video ' + (index + 1)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
