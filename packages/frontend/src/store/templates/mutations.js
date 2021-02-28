
export function setTemplates (state, payload) {
  state.templates = payload
}

export function loadTemplatesInit (state, payload) {
  state.isLoading = true
}

export function loadTemplatesSuccess (state, payload) {
  state.isLoading = false
  state.templates = payload
}

export function loadTemplatesError (state, payload) {
  state.isLoading = false
  state.error = payload
}
