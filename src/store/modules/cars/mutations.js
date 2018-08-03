import types from './types'

export default {
  [types.GET_CARS] (state, payload) {
    state.cars = payload.data
  },
  [types.GET_CAR] (state, payload) {
    state.car = payload.data
  }
}
