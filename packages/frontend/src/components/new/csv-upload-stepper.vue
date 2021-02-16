<template>
    <q-stepper
        v-model="step"
        color="primary"
        animated
        flat
    >
        <q-step
            :name="1"
            title="Download template"
            prefix="1"
            :done="step > 1"
        >
            Start with the {{template.name}} template csv file to populate with your own data.
            <q-stepper-navigation>
                <q-btn @click="getTemplateCSV(template.id)" color="primary" label="Download" />
                <q-btn flat @click="step = 2" color="primary" label="Skip" class="q-ml-sm" />
            </q-stepper-navigation>
        </q-step>

        <q-step
            :name="2"
            title="Upload your populated data"
            prefix="2"
            :done="step > 2"
        >
            Upload your csv file with the template data.
            <csvInput displayName="Template File" @updateInput="csvFile = $event" />
            <q-stepper-navigation>
                <q-btn @click="step = 3" color="primary" :disabled="!csvFile" label="Upload" />
                <q-btn flat @click="step = 1" color="primary" label="Back" class="q-ml-sm" />
            </q-stepper-navigation>
        </q-step>

        <q-step
            :name="3"
            title="Verify data"
            prefix="3"
        >
            <q-spinner class="q-mr-sm" color="primary" size="1.4em"/> We're checking your upload for any issues.

            <q-stepper-navigation>
                <q-btn flat @click="step = 1" color="primary" label="Cancel" class="q-ml-sm" />
            </q-stepper-navigation>
        </q-step>
    </q-stepper>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

import AuthService from '../../services/auth.service'

import csvInput from 'components/new/input-types/csv-input.vue'

export default {
  name: 'CSVUploadStepper',
  components: {
    csvInput
  },
  props: {
    template: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      step: 1,
      csvFile: undefined,
      validated: false
    }
  },
  methods: {
    ...mapActions('templates', [
      'getTemplateCSV'
    ]),
    // async downloadCsv () {
    //   // getTemplateCSV()
    //   const accessToken = await AuthService.getAccessToken()
    //   if (!accessToken) {
    //     return
    //   }
    //   await axios({
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //       Accept: 'application/octet-stream',
    //       'Content-Type': 'application/octet-stream'
    //     },
    //     method: 'GET',
    //     url: '/api/templates/' + this.template.id + '/csv',
    //     responseType: 'blob'
    //   }).then((response) => {
    //     const url = window.URL.createObjectURL(new Blob([response.data]))
    //     const link = document.createElement('a')
    //     link.href = url
    //     link.setAttribute('download', `${this.template.id}-template.csv`)
    //     document.body.appendChild(link)
    //     link.click()

    //     this.step = 2
    //   })
    // },
    async uploadCsv (e) {
      const formData = new FormData()
      const accessToken = await AuthService.getAccessToken()
      if (!accessToken) {
        return
      }
      await axios({
        headers: { Authorization: `Bearer ${accessToken}` },
        method: 'POST',
        url: '/api/csvimport/',
        data: formData
      }).then((res) => {
        if (res.data === 'success') {
          this.validated = true
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
