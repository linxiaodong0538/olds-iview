import consts from '@/utils/consts'
import helpers from 'apples/libs/helpers'

export default {
  ...helpers,
  /**
   * 获取图片地址
   */
  getImageURL ({ id }) {
    return `${consts.BASE_URL}/apis/v1/files/${id}`
  },
  getRoutePrefix (params) {
    const { topLevelMenu, secondLevelMenu, alias } = params
    return `/${topLevelMenu}/${secondLevelMenu}/${alias}`
  }
}
