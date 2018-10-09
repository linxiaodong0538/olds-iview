import types from './types'
import Model from '../../../models/videos'

export default {
  async getList ({ commit }, { query }) {
    const res = await new Model().GET({ query })

    commit(types.GET_VIDEO_LIST, {
      data: res.data
    })

    return res.data
  },

  async getDetail ({ commit }, { id }) {
    const res = await new Model().GET({ id })

    commit(types.GET_STAFF, {
      data: res.data
    })

    return res.data
  },

  async post ({ commit }, { body }) {
    return new Model().POST({ body })
  },

  async put ({ commit }, { id, body }) {
    return new Model().PUT({ id, body })
  },
}
