import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import articles from './modules/articles'
import products from './modules/products'
import cars from './modules/cars'
import staffs from './modules/staffs'
import olds from './modules/olds'
import notices from './modules/notices'
import roles from './modules/roles'
import permissions from './modules/permissions'
import categories from './modules/categories'
import settings from './modules/settings'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    language: 'zh-CN'
  },
  getters,
  actions,
  mutations,
  modules: {
    articles,
    products,
    cars,
    staffs,
    olds,
    notices,
    roles,
    permissions,
    categories,
    settings
  }
})
