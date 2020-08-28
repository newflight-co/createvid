<template>
    <q-page>
        <div class="admin-users">
            <div class="row q-mt-xl">
                <div class="col">
                    <q-input filled v-model="newUser" label="Email">
                        <template v-slot:append>
                            <q-btn @click="createUser()" class="q-ml-sm" color="primary" label="Add New User"/>
                        </template>
                    </q-input>
                </div>
            </div>
            <div class="row q-mt-md">
                <div class="col">
                <q-table
                    class="q-mt-md"
                    :data="users"
                    :columns="columns"
                    row-key="name"
                    flat
                    bordered
                    hide-bottom
                >
                    <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="id" :props="props">
                        {{ props.row.id }}
                      </q-td>
                      <q-td key="email" :props="props">
                            <q-input outlined
                                dense
                                v-if="editing === props.row.id"
                                :value="props.row.email"
                            >
                                <template v-slot:append>
                                    <q-btn class="q-ml-sm" size="sm" outline color="primary" label="Update" @click="update(props.row)"/>
                                </template>
                            </q-input>
                            <span v-if="editing !== props.row.id">{{ props.row.email }}</span>
                        </q-td>
                      <q-td key="admin" :props="props">
                        <q-toggle outlined
                                 dense
                                  v-if="editing === props.row.id"
                                 :value="props.row.admin"
                        >
                          <template v-slot:append>
                            <q-btn class="q-ml-sm" size="sm" outline color="primary" label="Update" @click="update()"/>
                          </template>
                        </q-toggle>
                        <span v-if="editing !== props.row.id">{{ props.row.admin ? 'admin' : '' }}</span>
                      </q-td>
                      <q-td key="opts" :props="props">
                        <div class="actions" style="display: inline" v-if="!props.row.editing">
                          <q-btn class="float-right" flat round icon="create" color="primary" size="sm" @click="setEditing(props.row.id)">
                                    <q-tooltip anchor="top middle" self="bottom middle">
                                    Edit
                                    </q-tooltip>
                                </q-btn>
                          <q-btn class="float-right" flat round icon="email" color="primary" size="sm" @click="welcome(props.row.id)">
                            <q-tooltip anchor="top middle" self="bottom middle">
                              Welcome
                            </q-tooltip>
                          </q-btn>
                                <q-btn class="float-right" flat round icon="delete_outline" color="negative" size="sm" @click="removeUser(props.row.id)">
                                    <q-tooltip anchor="top middle" self="bottom middle">
                                    Delete
                                    </q-tooltip>
                                </q-btn>
                            </div>
                        </q-td>
                    </q-tr>
                    </template>
                </q-table>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import api from '../services/api.service'
export default {
  name: 'PageUserAdmin',
  meta () {
    return {
      title: 'Manage Users'
    }
  },
  data () {
    return {
      newUser: '',
      editing: false,
      columns: [
        { name: 'id', label: '#', align: 'left', sortable: true },
        { name: 'email', label: 'Email', align: 'left', sortable: true },
        { name: 'admin', label: 'Is admin', align: 'left', sortable: false },
        { name: 'opts', label: '', align: 'left', sortable: false }
      ],
      data: [
        { email: 'name@email.com' },
        { email: 'name@email.com' },
        { email: 'name@email.com' }
      ]
    }
  },
  mounted () {
    this.loadUsers()
  },
  computed: {
    ...mapState('users', {
      users: 'users'
    })
  },
  methods: {
    ...mapActions('users', [
      'loadUsers'
    ]),
    setEditing (id) {
      this.editing = id
    },
    async update (row) {
      await this.updateUser(row.id, row.email, row.admin)
      this.editing = false
    },
    async welcome (id) {
      await api.sendWelcome(id)
    },
    async createUser () {
      if (this.newUser) {
        await api.createUser(this.newUser)
        this.newUser = ''
        await this.loadUsers()
      }
    },
    async removeUser (id) {
      await api.removeUser(id)
      await this.loadUsers()
    },
    async updateUser (id, email, admin) {
      await api.updateUser(id, email, admin)
      await this.loadUsers()
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
