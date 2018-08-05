import types from './types'
import Model from '../../../models/olds'

export default {
  /**
   * 获取列表
   */
  getOlds ({ commit }, { query }) {
    return new Model().GET({ query }).then((res) => {
      commit(types.GET_OLDS, {
        data: res.data
      })
    })
  },

  /**
   * 获取详情
   */
  getOld ({ commit }, { id }) {
    return new Model().GET({ id }).then((res) => {
      commit(types.GET_OLD, {
        data: res.data
      })
    })
  },

  /**
   * 新增
   */
  postOld ({ commit }, { body }) {
    return new Model().POST({ body })
  },

  /**
   * 编辑
   */
  putOld ({ commit }, { id, body }) {
    return new Model().PUT({ id, body })
  },

  /**
   * 删除
   */
  deleteOld ({ commit }, { id }) {
    return new Model().DELETE({ id })
  }
}
