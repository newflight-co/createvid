<template>
  <div class="row q-mt-md q-mb=none">
    <div class="col-12">
      <q-input outlined v-model="input" :label="displayName">
        <template v-slot:append>
          <q-btn class="q-ml-sm" outline color="primary" label="Browse"  @click.native="$refs.fileInput.click()"/>
        </template>
      </q-input>
      <input type="file" accept=".csv" ref="fileInput" @change="getFileInfo" class="hidden">
    </div>
  </div>
</template>

<script>

export default {
  name: 'CsvInput',
  props: {
    displayName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      input: ''
    }
  },
  methods: {
    getFileInfo () {
      this.input = this.$refs.fileInput.files[0].name
    }
  },
  watch: {
    input: function (value) {
      this.$emit('updateInput', value)
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
