import types from './types'
import Model from '../../../models/cars'

export default {
  /**
   * 获取列表
   */
  getCars ({ commit }, { query }) {
    return new Model().GET({ query }).then((res) => {
      commit(types.GET_CARS, {
        data: res.data
      })
    })
  },

  /**
   * 获取详情
   */
  getCar ({ commit }, { id }) {
    return new Model().GET({ id }).then((res) => {
      commit(types.GET_CAR, {
        data: res.data
      })
    })
  },

  /**
   * 新增
   */
  postCar ({ commit }, { body }) {
    return new Model().POST({ body })
  },

  /**
   * 编辑
   */
  putCar ({ commit }, { id, body }) {
    return new Model().PUT({ id, body })
  },

  /**
   * 删除
   */
  deleteCar ({ commit }, { id }) {
    return new Model().DELETE({ id })
  }
}
