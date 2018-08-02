import types from './types'

export default {
  [types.GET_PRODUCTS] (state, payload) {
    state.products = payload.data
  },
  [types.GET_PRODUCT] (state, payload) {
    state.product = payload.data
  }
}
