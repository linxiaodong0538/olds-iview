import types from './types'

export default {
  [types.GET_MESSAGES] (state, payload) {
    state.messages = payload.data
  },
  [types.GET_MESSAGE] (state, payload) {
    state.message = payload.data
  }
}
