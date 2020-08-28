<template>
  <q-card-section class="q-pa-md">
    <div class="row">
      <div class="col q-pt-xs">
        <strong>{{ title }}</strong>
        <q-chip v-if="error" class="q-ml-md" outline dense color="warning" icon-right="warning">
          validation errors
        </q-chip>
      </div>
      <div class="col text-right" v-if="showDelete">
        <q-btn class="float-right" outline color="negative" size="sm" @click="remove($event)">Delete</q-btn>
      </div>
    </div>
  </q-card-section>
</template>

<script>
export default {
  name: 'VideoCardHeader',
  props: {
    showDelete: {
      type: Boolean,
      required: false
    },
    title: {
      type: String,
      required: true
    },
    error: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    remove (ev) {
      this.$emit('remove', ev)
    },
    focus (ev) {
      this.$emit('focus', ev)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
