<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section>
        <div class="text-h6">Delete Video</div>
      </q-card-section>

      <q-card-section>
        Are you sure you want to delete this video? <span class="warning">This cannot be undone.</span>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn size="sm" outline label="Delete" color="negative" @click="$emit('delete', videoToDelete)"/>
        <q-btn size="sm" flat label="Cancel" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'DeleteDialog',
  props: {
    show: {
      type: Boolean
    },
    videoToDelete: {
      type: String
    }
  }
}
</script>
