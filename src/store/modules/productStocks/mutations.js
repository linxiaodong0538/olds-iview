import types from './types'

export default {
  [types.GET_PRODUCT_STOCKS] (state, payload) {
    state.productStocks = payload.data
  },
  [types.GET_PRODUCT_STOCK] (state, payload) {
    state.productStock = payload.data
  }
}
