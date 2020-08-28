<template>
  <q-page>
    <div class="q-px-md">
      <div class="row">
        <PageTitle v-if="template" :title="template.title + ' Videos'"/>
        <PageActions cancel text="Create New" :to="'/new/' + templateID"/>
      </div>
      <!-- <div class="row justify-end">
        <q-btn-group class="q-mb-md">
          <q-btn icon="grid_on" size="sm" @click="view = 'grid'" :color="view === 'grid' ? 'primary' : 'white'" :text-color="view === 'grid' ? 'white' : 'black'"/>
          <q-btn icon="view_list" size="sm" @click="view = 'table'" :color="view === 'table' ? 'primary' : 'white'" :text-color="view === 'table' ? 'white' : 'black'"/>
        </q-btn-group>
      </div> -->
      <!-- <Analytics/> -->
      <div class="row" v-if="view === 'table'">
        <div class="col">
          <q-table
            class="q-mt-md"
            :data="videos"
            :columns="columns"
            row-key="name"
            flat
            bordered
            hide-bottom
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="title" :props="props">
                  {{ props.row.title }}
                </q-td>
                <q-td key="status" :props="props">
                  {{ friendlyStatus(props.row.__index) }}
                </q-td>
                <q-td key="share" :props="props">
                  <div class="text-pre-wrap"><a :href="'/share/' + props.row.id">{{'/share/' + props.row.id}}</a></div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
      <div class="row q-col-gutter-lg" v-if="view === 'grid'">
        <div v-for="(video) in videos.slice().reverse()" :key="video.id" class="col-12 col-sm-6 col-md-4">
          <LibraryCard :video="video" @delete="confirmDelete($event)" @restart="restartVideo($event)"/>
        </div>
      </div>
    </div>
    <DeleteDialog :show="deleteModal" :videoToDelete="videoToDelete" @delete="deleteVideo($event)"></DeleteDialog>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import PageTitle from 'components/page-title.vue'
import PageActions from 'components/page-actions.vue'
// import Analytics from 'components/analytics.vue'
import LibraryCard from 'components/library-card.vue'
import DeleteDialog from 'components/dialogs/delete-dialog.vue'
import ApiService from '../services/api.service'

export default {
  name: 'PageLibrary',
  meta () {
    return {
      title: 'Library'
    }
  },
  components: {
    PageTitle,
    PageActions,
    // Analytics,
    LibraryCard,
    DeleteDialog
  },
  data () {
    return {
      view: 'grid',
      deleteModal: false,
      videoToDelete: undefined,
      columns: [
        {
          name: 'title', required: true, label: 'Title', align: 'left', sortable: true
        },
        {
          name: 'status',
          required: true,
          label: 'Status',
          align: 'left',
          sortable: true
        },
        {
          name: 'share',
          required: true,
          label: 'Share URL',
          align: 'left'
        }
      ]
    }
  },
  mounted () {
    this.loadTemplates()
    this.loadVideos(this.templateID)
    this.refresh = setInterval(() => this.loadVideos(this.templateID), 2000)
  },
  beforeDestroy () {
    if (this.refresh) {
      clearInterval(this.refresh)
    }
  },
  computed: {
    ...mapState('videos', {
      videos: 'videos'
    }),
    templateID () {
      return this.$route.params.templateid
    },
    template () {
      return this.$store.getters['templates/getTemplateById'](this.templateID)
    }
  },
  methods: {
    async deleteTask (id) {
      this.deleteModal = false
      await ApiService.deleteTask(id)
      this.loadVideos(this.templateID)
    },
    ...mapActions('videos', [
      'loadVideos'
    ]),
    ...mapActions('templates', [
      'loadTemplates'
    ]),
    async deleteVideo (videoId) {
      this.deleteModal = false
      await ApiService.deleteTask(videoId)
      this.loadVideos(this.templateID)
    },
    async restartVideo (videoId) {
      await ApiService.restartTask(videoId)
      this.loadVideos(this.templateID)
    },
    confirmDelete (videoId) {
      this.deleteModal = true
      this.videoToDelete = videoId
    }
  }
}
</script>
