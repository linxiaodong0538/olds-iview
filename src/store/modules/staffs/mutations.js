import types from './types'

export default {
  [types.GET_STAFFS] (state, payload) {
    state.staffs = payload.data
  },
  [types.GET_STAFF] (state, payload) {
    state.staff = payload.data
  }
}
