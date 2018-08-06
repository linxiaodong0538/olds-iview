import types from './types'

export default {
  [types.GET_NOTICES] (state, payload) {
    state.notices = payload.data
  },
  [types.GET_NOTICE] (state, payload) {
    state.notice = payload.data
  }
}
