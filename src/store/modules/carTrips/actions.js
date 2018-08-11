import types from './types'
import Model from '../../../models/carTrips'

export default {
  /**
   * 获取列表
   */
  getCarTrips ({ commit }, { query }) {
    return new Model().GET({ query }).then((res) => {
      commit(types.GET_CAR_TRIPS, {
        data: res.data
      })
    })
  },

  /**
   * 获取详情
   */
  getCarTrip ({ commit }, { id }) {
    return new Model().GET({ id }).then((res) => {
      commit(types.GET_CAR_TRIP, {
        data: res.data
      })
    })
  },

  /**
   * 新增
   */
  postCarTrip ({ commit }, { body }) {
    return new Model().POST({ body })
  },

  /**
   * 编辑
   */
  putCarTrip ({ commit }, { id, body }) {
    return new Model().PUT({ id, body })
  },

  /**
   * 删除
   */
  delCarTrip ({ commit }, { id }) {
    return new Model().DELETE({ id })
  }
}
