<template>
  <div class="row q-mb-md">
    <div class="col-12">
      <q-input v-if="module === null" outlined v-model="input" :label="displayName">
        <template v-slot:append>
          <q-btn class="q-ml-sm" outline color="primary" label="Browse"  @click.native="$refs.fileInput.click()"/>
        </template>
        <input type="file" accept="video/*" ref="fileInput" @change="getFileInfo" class="hidden">
      </q-input>
      <WebcamRecording v-if="module === 'webcam'" />
      <ScreenRecording v-if="module === 'screen'" />
    </div>
  </div>
</template>

<script>
import WebcamRecording from 'components/new/input-types/webcamRecording-input.vue'
import ScreenRecording from 'components/new/input-types/screenRecording-input.vue'

export default {
  name: 'VideoInput',
  props: {
    displayName: {
      type: String,
      required: true
    },
    module: {
      type: String,
      default: null
    }
  },
  components: { WebcamRecording, ScreenRecording },
  data () {
    return {
      input: ''
    }
  },
  methods: {
    getFileInfo () {
      this.input = this.$refs.fileInput.files[0].name
      this.$emit('updateInput', this.$refs.fileInput.files[0])
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
