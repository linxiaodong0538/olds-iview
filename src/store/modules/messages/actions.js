import types from './types'
import Model from '../../../models/messages'

export default {
  /**
   * 获取列表
   */
  getMessages ({ commit }, { query }) {
    return new Model().GET({ query }).then((res) => {
      commit(types.GET_MESSAGES, {
        data: res.data
      })
    })
  },

  /**
   * 获取详情
   */
  getMessage ({ commit }, { id }) {
    return new Model().GET({ id }).then((res) => {
      commit(types.GET_MESSAGE, {
        data: res.data
      })
    })
  },

  /**
   * 新增
   */
  postMessage ({ commit }, { body }) {
    return new Model().POST({ body })
  },

  /**
   * 编辑
   */
  putMessage ({ commit }, { id, body }) {
    return new Model().PUT({ id, body })
  },

  /**
   * 删除
   */
  delMessage ({ commit }, { id }) {
    return new Model().DELETE({ id })
  }
}
