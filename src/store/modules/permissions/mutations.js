import types from './types'

export default {
  [types.GET_PERMISSIONS] (state, payload) {
    state.permissions = payload.data
  },
  [types.GET_PERMISSION] (state, payload) {
    state.permission = payload.data
  }
}
