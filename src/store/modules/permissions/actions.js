import types from './types'
import Model from '../../../models/permissions'

export default {
  /**
   * 获取列表
   */
  getPermissions ({ commit }, { query }) {
    return new Model().GET({ query }).then((res) => {
      commit(types.GET_PERMISSIONS, {
        data: res.data
      })
    })
  },

  /**
   * 获取详情
   */
  getPermission ({ commit }, { id }) {
    return new Model().GET({ id }).then((res) => {
      commit(types.GET_PERMISSION, {
        data: res.data
      })
    })
  },

  /**
   * 新增
   */
  postPermission ({ commit }, { body }) {
    return new Model().POST({ body })
  },

  /**
   * 编辑
   */
  putPermission ({ commit }, { id, body }) {
    return new Model().PUT({ id, body })
  },

  /**
   * 删除
   */
  delPermission ({ commit }, { id }) {
    return new Model().DELETE({ id })
  }
}
