import types from './types'

export default {
  [types.GET_OLDS] (state, payload) {
    state.olds = payload.data
  },
  [types.GET_OLD] (state, payload) {
    state.old = payload.data
  }
}
