import types from './types'
import Model from '../../../models/productStocks'

export default {
  /**
   * 获取列表
   */
  getProductStocks ({ commit }, { query }) {
    return new Model().GET({ query }).then((res) => {
      commit(types.GET_PRODUCT_STOCKS, {
        data: res.data
      })
    })
  },

  /**
   * 获取详情
   */
  getProductStock ({ commit }, { id }) {
    return new Model().GET({ id }).then((res) => {
      commit(types.GET_PRODUCT_STOCK, {
        data: res.data
      })
    })
  },

  /**
   * 新增
   */
  postProductStock ({ commit }, { body }) {
    return new Model().POST({ body })
  },

  /**
   * 编辑
   */
  putProductStock ({ commit }, { id, body }) {
    return new Model().PUT({ id, body })
  },

  /**
   * 删除
   */
  delProductStock ({ commit }, { id }) {
    return new Model().DELETE({ id })
  }
}
