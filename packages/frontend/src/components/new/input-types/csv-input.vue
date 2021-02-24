<template>
  <div class="row q-mt-md q-mb=none">
    <div class="col-12">
      <q-input outlined v-model="name" :label="displayName">
        <template v-slot:append>
          <q-btn class="q-ml-sm" outline color="primary" label="Browse"  @click.native="$refs.fileInput.click()"/>
        </template>
      </q-input>
      <input type="file" accept=".zip" ref="fileInput" @change="getFileInfo" class="hidden">
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
      input: '',
      name: ''
    }
  },
  methods: {
    getFileInfo () {
      this.input = this.$refs.fileInput.files[0]
      this.name = this.input.name
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
