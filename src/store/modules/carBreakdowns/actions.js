import types from './types'
import Model from '../../../models/carBreakdowns'

export default {
  /**
   * 获取列表
   */
  getCarBreakdowns ({ commit }, { query }) {
    return new Model().GET({ query }).then((res) => {
      commit(types.GET_CAR_BREAKDOWNS, {
        data: res.data
      })
    })
  },

  /**
   * 获取详情
   */
  getCarBreakdown ({ commit }, { id }) {
    return new Model().GET({ id }).then((res) => {
      commit(types.GET_CAR_BREAKDOWN, {
        data: res.data
      })
    })
  },

  /**
   * 新增
   */
  postCarBreakdown ({ commit }, { body }) {
    return new Model().POST({ body })
  },

  /**
   * 编辑
   */
  putCarBreakdown ({ commit }, { id, body }) {
    return new Model().PUT({ id, body })
  },

  /**
   * 删除
   */
  delCarBreakdown ({ commit }, { id }) {
    return new Model().DELETE({ id })
  }
}
