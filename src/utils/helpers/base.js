import consts from '@/utils/consts'
import helpers from 'jt-helpers'

export default {
  ...helpers,
  goBack () {
    window.history.go(-1)
  },
  /**
   * 深拷贝对象
   */
  deepCopy (obj) {
    return JSON.parse(JSON.stringify(obj))
  },
  /**
   * 获取图片地址
   */
  getFileURLById (id) {
    return `${consts.BASE_URL}/apis/v1/files/${id}`
  },
  getRoutePrefix (params) {
    const { topLevelMenu, secondLevelMenu, alias } = params
    return `/${topLevelMenu}/${secondLevelMenu}/${alias}`
  },
  getItem (items, key, val) {
    return items && items.length
      ? (items.find(item => item[key] === val) || {})
      : {}
  },
  getItemById (items, id) {
    return items && items.length
      ? (items.find(item => +item.id === +id) || {})
      : {}
  }
}
