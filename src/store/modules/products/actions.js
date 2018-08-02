import types from './types'
import Model from '../../../models/products'

export default {
  /**
   * 获取列表
   */
  getProducts ({ commit }, { query }) {
    return new Model().GET({ query }).then((res) => {
      commit(types.GET_PRODUCTS, {
        data: res.data
      })
    })
  },

  /**
   * 获取详情
   */
  getProduct ({ commit }, { id }) {
    return new Model().GET({ id }).then((res) => {
      commit(types.GET_PRODUCT, {
        data: res.data
      })
    })
  },

  /**
   * 新增
   */
  postProduct ({ commit }, { body }) {
    return new Model().POST({ body })
  },

  /**
   * 编辑
   */
  putProduct ({ commit }, { id, body }) {
    return new Model().PUT({ id, body })
  },

  /**
   * 删除
   */
  deleteProduct ({ commit }, { id }) {
    return new Model().DELETE({ id })
  }
}
