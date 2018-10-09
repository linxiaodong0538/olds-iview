import types from './types'

export default {
  [types.GET_VIDEO_LIST] (state, payload) {
    state.list = payload.data
  },
  [types.GET_VIDEO_DETAIL] (state, payload) {
    state.detail = payload.data
  }
}
