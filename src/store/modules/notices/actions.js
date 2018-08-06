import types from './types'
import Model from '../../../models/notices'

export default {
  /**
   * 获取列表
   */
  getNotices ({ commit }, { query }) {
    return new Model().GET({ query }).then((res) => {
      commit(types.GET_NOTICES, {
        data: res.data
      })
    })
  },

  /**
   * 获取详情
   */
  getNotice ({ commit }, { id }) {
    return new Model().GET({ id }).then((res) => {
      commit(types.GET_NOTICE, {
        data: res.data
      })
    })
  },

  /**
   * 新增
   */
  postNotice ({ commit }, { body }) {
    return new Model().POST({ body })
  },

  /**
   * 编辑
   */
  putNotice ({ commit }, { id, body }) {
    return new Model().PUT({ id, body })
  },

  /**
   * 删除
   */
  deleteNotice ({ commit }, { id }) {
    return new Model().DELETE({ id })
  }
}
