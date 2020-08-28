<template>
  <div class="row">
    <div class="col-12">
      <q-input
        outlined
        v-model="input"
        :label="displayName + (required ? ' (required)' : '')"
        @input="$v.input.$touch()"
        :rules="[val => $v.input.required]"
      >
        <template v-slot:append>
          <div class="exampleSquare q-mr-sm" :style="{ 'background-color' : input }" />
          <q-icon name="colorize" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-color v-model="input" format-model="hex" no-header no-footer />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
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
      input: ''
    }
  },
  computed: {
    hexColour () {
      return this.input.slice(1)
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
    hexColour: function (value) {
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
.exampleSquare {
  width: 25px;
  height: 25px;
  border: 1px solid $light;
  border-radius: 5px;
}
</style>
