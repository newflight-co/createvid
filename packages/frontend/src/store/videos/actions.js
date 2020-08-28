import { apiCall } from '../../helpers/apiCall'

export function loadVideos ({ commit }, templateId) {
  return apiCall(commit, {
    method: 'GET',
    url: `/templates/${templateId}/tasks`,
    types: [
      'loadVideosInit',
      'loadVideosSuccess',
      'loadVideosError'
    ]
  })
}
