// import env from 'jt-env'
import MENUS from './menus'
import ROLES from './roles'
import ALIASES from './aliases'
import GENDERS from './genders'
import EDUCATION_DEGREES from './educationDegrees'
import NURSING_GRADES from './nursingGrades'
import NOTICE_COLUMNS from './noticeColumns'
import HEALTH_INDICATORS from './healthIndicators'

// 基础地址
const BASE_URL = 'https://www.rjwb.cn' // env.isDev() ? 'http://localhost:3002' : 'https://www.chongyangyanglao.com'

// 接口地址
const API_URL = BASE_URL + '/apis/v1'

// 分页大小
const PAGE_SIZE = 10

// 网站标题
const TITLE = '网站后台'

export default {
  MENUS,
  ROLES,
  ALIASES,
  GENDERS,
  EDUCATION_DEGREES,
  NURSING_GRADES,
  NOTICE_COLUMNS,
  HEALTH_INDICATORS,
  BASE_URL,
  API_URL,
  PAGE_SIZE,
  TITLE
}
