import types from './types'

export default {
  [types.GET_CAR_TRIPS] (state, payload) {
    state.carTrips = payload.data
  },
  [types.GET_CAR_TRIP] (state, payload) {
    state.carTrip = payload.data
  }
}
