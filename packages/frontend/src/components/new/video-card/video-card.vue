<template>
  <q-card flat bordered>

    <VideoCardHeader
      @remove="remove($event)"
      @click.native="focus($event)"
      :showDelete="showDelete"
      :title="title"
      :error="errors && !focused"
    />

    <VideoCardBody
      :template="template"
      :video="video"
      v-show="focused"
      @setValidity="setValidity($event)"
      @titleChanged="updateTitle($event)"
    />
  </q-card>
</template>

<script>
import VideoCardHeader from './video-card-header'
import VideoCardBody from './video-card-body'

export default {
  name: 'VideoCard',
  components: {
    VideoCardHeader,
    VideoCardBody
  },
  props: {
    showDelete: {
      type: Boolean,
      required: false
    },
    focused: {
      type: Boolean,
      required: false
    },
    template: {
      type: Object,
      required: true
    },
    video: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      title: 'Video ' + (this.index + 1),
      errors: false
    }
  },
  methods: {
    updateTitle (title) {
      this.title = title === undefined ? 'Video ' + (this.index + 1) : title
    },
    remove (ev) {
      this.$emit('remove', ev)
    },
    focus (ev) {
      this.$emit('focus', ev)
    },
    setValidity (ev) {
      this.errors = !ev
      this.$root.$emit('videoValid', { errors: this.errors, index: this.index })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
