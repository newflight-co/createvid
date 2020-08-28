<template>
  <div class="row">
    <div class="col-12">
      <q-input
        outlined
        v-model="input"
        :label="displayName + (required ? ' (required)' : '')"
        @input="$v.input.$touch()"
        :rules="[val => $v.input.required]"
      />
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'TextInput',
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
      input: ''
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
        this.$emit('updateInput', value)
      } else {
        this.$emit('updateInput', undefined)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
