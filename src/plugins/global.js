import time from 'jt-time'
import helpers from '../utils/helpers/base'
import consts from '../utils/consts'

export default {
  install (Vue, options) {
    Vue.prototype.$consts = consts

    Vue.prototype.$helpers = helpers

    Vue.filter('time', val => time.getTime(val))

    Vue.filter('date', val => time.getDate(val))
  }
}
