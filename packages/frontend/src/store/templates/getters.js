export function countVideos (state, { templateIndex }) {
  // TODO: Count number of videos available for each template and add to state
  return templateIndex + 1
}

export const getTemplateById = (state) => (id) => {
  // console.log(state.isLoading)
  // console.log(state.templates)
  return state.templates.find(template => template.id === id)
}
