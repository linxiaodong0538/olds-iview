import types from './types'

export default {
  [types.GET_RELATIONS] (state, payload) {
    state.relations = payload.data
  },
  [types.GET_RELATION] (state, payload) {
    state.relation = payload.data
  }
}
