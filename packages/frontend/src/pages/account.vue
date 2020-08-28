<template>
   <q-page>
      <div class="q-px-md">
        <div class="row">
          <PageTitle title="Account"/>
          <PageActions cancel/>
        </div>
        <div class="row">
            <q-tabs
                v-model="tab"
                inline-label
                align="left"
                class="bg-primary text-white full-width"
            >
                <q-tab name="account" icon="account_circle" label="Account" />
                <!-- <q-tab name="branding" icon="format_paint" label="Branding" />
                <q-tab name="api" icon="device_hub" label="API" /> -->
            </q-tabs>
            <q-tab-panels v-model="tab" animated class="full-width q-pa-lg">
                <q-tab-panel name="account">
                    <div class="row">
                        <div class="col">
                            <div class="text-h6">Account Details</div>
                            <p>mateusz@russak.biz</p>
                        </div>
                    </div>
                    <div class="row">
                        <q-btn
                          rounded
                          class="no-shadow q-mt-md"
                          color="negative"
                          text-color="white"
                          size="md"
                          label="Log Out"
                          @click="logout()"
                        />
                    </div>
                </q-tab-panel>
<!--
                <q-tab-panel name="branding">
                    <div class="row">
                        <div class="col">
                            <div class="text-h6">Customisation Options</div>
                            <textInput
                                class="q-mt-md"
                                displayName="Brand name"
                                @updateInput="setName()"
                            />
                            <imageInput
                                displayName="Logo"
                                @updateInput="setLogo()"
                            />
                            <colourInput
                                displayName="Primary Colour"
                                @updateInput="setLogo()"
                            />
                            <colourInput
                                displayName="Secondary Colour"
                                @updateInput="setLogo()"
                            />
                        </div>
                    </div>
                </q-tab-panel>

                <q-tab-panel name="api">
                    <div class="text-h6">Connect to our API</div>
                    <q-input color="primary" class="q-mt-md" disabled filled v-model="apiKey" label="Your API key">
                        <template v-slot:prepend>
                            <q-icon name="vpn_key" />
                        </template>
                    </q-input>
                </q-tab-panel>
              --->
                </q-tab-panels>
        </div>
      </div>
   </q-page>
</template>

<script>
// import textInput from 'components/new/input-types/text-input.vue'
// import imageInput from 'components/new/input-types/image-input.vue'
// import colourInput from 'components/new/input-types/colour-input.vue'
import PageTitle from 'components/page-title.vue'
import PageActions from 'components/page-actions.vue'
import ApiService from '../services/api.service'

export default {
  name: 'PageUserAccount',
  meta () {
    return {
      title: 'Account'
    }
  },
  components: {
    PageTitle,
    PageActions
    // imageInput,
    // textInput,
    // colourInput
  },
  data () {
    return {
      tab: 'account',
      apiKey: '12345678900000'
    }
  },
  methods: {
    logout () {
      ApiService.auth.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
