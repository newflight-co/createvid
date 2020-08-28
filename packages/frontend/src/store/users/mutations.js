export function loadUsersInit (state, payload) {
  state.isLoading = true
}

export function loadUsersSuccess (state, payload) {
  state.isLoading = false
  state.users = payload
}

export function loadUsersError (state, payload) {
  state.isLoading = false
  state.error = payload
}
