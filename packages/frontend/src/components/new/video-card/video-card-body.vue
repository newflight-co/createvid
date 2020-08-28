<template>
  <q-card-section class="q-pa-md">
    <form
      ref="task"
      :action="'/api/templates/' + template.id + '/tasks'"
      method="post">
      <div v-for="(asset, aIndex) in template.assets" :key="aIndex" class="asset" @click="assetClicked(asset, $event)">
        <component :is="asset.type + 'Input'"
                   :displayName="asset.displayName"
                   :required="asset.required"
                   :module="asset.module"
                   @notValid="notValid(asset)"
                   @updateInput="updateInput(asset, $event)"
        />
      </div>
    </form>
  </q-card-section>
</template>

<script>
import * as inputTypes from '../input-types'

export default {
  name: 'VideoCardBody',
  components: {
    ...inputTypes
  },
  props: {
    template: {
      type: Object,
      required: true
    },
    video: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      invalidAssets: []
    }
  },
  mounted () {
    this.template.assets.forEach((asset) => {
      asset.required && this.notValid(asset)
    })
  },
  methods: {
    updateInput (asset, value) {
      if (asset.titleField) {
        this.$emit('titleChanged', value)
      }
      this.video[asset.layerName] = value

      if (value !== undefined) {
        this.invalidAssets = this.invalidAssets.filter(invalidAsset => asset.layerName !== invalidAsset)
      } else {
        this.invalidAssets.push(asset.layerName)
      }
    },
    notValid (asset) {
      this.invalidAssets.push(asset.layerName)
    },
    assetClicked (asset, ev) {
      this.$root.$emit('previewChapter', asset.chapterMarker)
    }
  },
  watch: {
    invalidAssets: function (assets) {
      assets.length ? this.$emit('setValidity', false) : this.$emit('setValidity', true)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
