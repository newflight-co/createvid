import { apiCall } from '../../helpers/apiCall'

/*
export function loadTemplates (context) {
  // mock ajax load from database
  let templateList = [
    {
      name: 'Fly By',
      poster: 'https://storage.googleapis.com/createvidio-templates/ciphr_flyby_thumb.png',
      source: 'https://storage.googleapis.com/createvidio-templates/ciphr_flyby_preview.mp4',
      count: 12
    },
    {
      name: 'Demo Screens',
      poster: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Big_Buck_Bunny_thumbnail_vlc.png',
      source: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      count: 8
    },
    {
      name: 'Intro',
      poster: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Big_Buck_Bunny_thumbnail_vlc.png',
      source: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      count: 24
    }
  ]
  context.commit('setTemplates', templateList)
}
*/

export function loadTemplates ({ commit }) {
  apiCall(commit, {
    method: 'GET',
    url: '/templates',
    types: [
      'loadTemplatesInit',
      'loadTemplatesSuccess',
      'loadTemplatesError'
    ]
  })
}

export function loadTemplateFields ({ commit }, templateId) {
  apiCall(commit, {
    method: 'GET',
    url: `/templates/${templateId}/fields`,
    types: [
      'loadTemplateFieldsInit',
      'loadTemplateFieldsSuccess',
      'loadTemplateFieldsError'
    ]
  })
}
