import types from './types'
import Model from '../../../models/roles'

export default {
  /**
   * 获取列表
   */
  getRoles ({ commit }, { query }) {
    return new Model().GET({ query }).then((res) => {
      commit(types.GET_ROLES, {
        data: res.data
      })
    })
  },

  /**
   * 获取详情
   */
  getRole ({ commit }, { id }) {
    return new Model().GET({ id }).then((res) => {
      commit(types.GET_ROLE, {
        data: res.data
      })
    })
  },

  /**
   * 新增
   */
  postRole ({ commit }, { body }) {
    return new Model().POST({ body })
  },

  /**
   * 编辑
   */
  putRole ({ commit }, { id, body }) {
    return new Model().PUT({ id, body })
  },

  /**
   * 删除
   */
  deleteRole ({ commit }, { id }) {
    return new Model().DELETE({ id })
  }
}
