<template>
    <div class="col-12 col-md-6 q-my-md q-my-md-xl">
      <div class="row text-right justify-end q-col-gutter-md">
        <div class="col-12 col-md-6" v-if="cancel">
          <q-btn rounded class="full-width no-shadow" color="white" text-color="black" size="md" label="back" to="/" />
        </div>
        <div class="col-12 col-md-6" v-if="text">
          <q-btn rounded class="full-width no-shadow" color="primary" size="md" :label="text" :to="to" :disabled="isDisabled" :loading="loading" @click="$emit('btn-click')" />
        </div>
      </div>
    </div>
</template>

<script>

export default {
  name: 'Actions',
  props: {
    text: {
      type: String,
      default: null
    },
    to: {
      type: String,
      default: null
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    cancel: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
