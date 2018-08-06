import types from './types'

export default {
  [types.GET_FAMILIES] (state, payload) {
    state.families = payload.data
  },
  [types.GET_FAMILY] (state, payload) {
    state.family = payload.data
  }
}
