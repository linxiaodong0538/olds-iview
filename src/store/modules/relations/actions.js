import types from './types'
import Model from '../../../models/relations'

export default {
  /**
   * 获取列表
   */
  getRelations ({ commit }, { query }) {
    return new Promise(resolve => {
      new Model().GET({ query }).then((res) => {
        commit(types.GET_RELATIONS, {
          data: res.data
        })
        resolve(res)
      })
    })
  },

  /**
   * 获取详情
   */
  getRelation ({ commit }, { id }) {
    return new Model().GET({ id }).then((res) => {
      commit(types.GET_RELATION, {
        data: res.data
      })
    })
  },

  /**
   * 新增
   */
  postRelation ({ commit }, { body }) {
    return new Model().POST({ body })
  },

  /**
   * 编辑
   */
  putRelation ({ commit }, { id, body }) {
    return new Model().PUT({ id, body })
  },

  /**
   * 删除
   */
  delRelation ({ commit }, { id }) {
    return new Model().DELETE({ id })
  }
}
