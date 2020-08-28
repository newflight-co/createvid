import api from '../services/api.service'

export const apiCall = async (commit, { types, ...params }) => {
  commit(types[0])
  api.apiCall(params)
    .then((resp) => {
      commit(types[1], resp.data)
    })
    .catch((err) => {
      commit(types[2], err)
    })
}
