<template>
  <div class="row">
    <div class="col-12">
      <q-input outlined
               v-model="input"
               :label="displayName + (required ? ' (required)' : '')"
               @input="$v.input.$touch()"
               :rules="[val => $v.input.required]"
      >
        <template v-slot:append>
          <q-btn class="q-ml-sm" outline color="primary" label="Browse"  @click.native="$refs.fileInput.click()"/>
        </template>
      </q-input>
      <input type="file" accept="image/png, image/jpeg, image/jpg" ref="fileInput" @change="getFileInfo" class="hidden">
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'ImageInput',
  props: {
    displayName: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      input: null
    }
  },
  methods: {
    getFileInfo () {
      this.input = this.$refs.fileInput.files[0].name
    }
  },
  validations () {
    if (this.required) {
      return {
        input: {
          required
        }
      }
    } else {
      return { input: {} }
    }
  },
  watch: {
    input: function (value) {
      if (!this.$v.$anyError) {
        this.$emit('updateInput', this.$refs.fileInput.files[0])
      } else {
        this.$emit('updateInput', undefined)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
