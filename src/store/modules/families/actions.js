import types from './types'
import Model from '../../../models/families'

export default {
  /**
   * 获取列表
   */
  getFamilies ({ commit }, { query }) {
    return new Model().GET({ query }).then((res) => {
      commit(types.GET_FAMILIES, {
        data: res.data
      })
    })
  },

  /**
   * 获取详情
   */
  getFamily ({ commit }, { id }) {
    return new Model().GET({ id }).then((res) => {
      commit(types.GET_FAMILY, {
        data: res.data
      })
    })
  },

  /**
   * 新增
   */
  postFamily ({ commit }, { body }) {
    return new Model().POST({ body })
  },

  /**
   * 编辑
   */
  putFamily ({ commit }, { id, body }) {
    return new Model().PUT({ id, body })
  },

  /**
   * 删除
   */
  delFamily ({ commit }, { id }) {
    return new Model().DELETE({ id })
  }
}
