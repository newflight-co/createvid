
export function setVideos (state, payload) {
  state.videos = payload
}

export function loadVideosInit (state, payload) {
  state.isLoading = true
}

export function loadVideosSuccess (state, payload) {
  state.isLoading = false
  state.videos = payload
}

export function loadVideosError (state, payload) {
  state.isLoading = false
  state.error = payload
}
