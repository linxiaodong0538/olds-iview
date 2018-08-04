import types from './types'
import Model from '../../../models/staffs'

export default {
  /**
   * 获取列表
   */
  getStaffs ({ commit }, { query }) {
    return new Model().GET({ query }).then((res) => {
      commit(types.GET_STAFFS, {
        data: res.data
      })
    })
  },

  /**
   * 获取详情
   */
  getStaff ({ commit }, { id }) {
    return new Model().GET({ id }).then((res) => {
      commit(types.GET_STAFF, {
        data: res.data
      })
    })
  },

  /**
   * 新增
   */
  postStaff ({ commit }, { body }) {
    return new Model().POST({ body })
  },

  /**
   * 编辑
   */
  putStaff ({ commit }, { id, body }) {
    return new Model().PUT({ id, body })
  },

  /**
   * 删除
   */
  deleteStaff ({ commit }, { id }) {
    return new Model().DELETE({ id })
  }
}
