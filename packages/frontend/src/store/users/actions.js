import { apiCall } from '../../helpers/apiCall'

export function loadUsers ({ commit }) {
  return apiCall(commit, {
    method: 'GET',
    url: `/users/`,
    types: [
      'loadUsersInit',
      'loadUsersSuccess',
      'loadUsersError'
    ]
  })
}
