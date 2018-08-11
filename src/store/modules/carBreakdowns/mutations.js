import types from './types'

export default {
  [types.GET_CAR_BREAKDOWNS] (state, payload) {
    state.carBreakdowns = payload.data
  },
  [types.GET_CAR_BREAKDOWN] (state, payload) {
    state.carBreakdown = payload.data
  }
}
