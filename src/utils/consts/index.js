import MENUS from './menus'
import ROLES from './roles'
import ALIASES from './aliases'
import GENDERS from './genders'
import EDUCATION_DEGREES from './educationDegrees'
import NURSING_GRADES from './nursingGrades'
import NOTICE_COLUMNS from './noticeColumns'

// 当前 host
const HOST = window.location.host

// 开发
const DEV = 'DEV'

// 生产
const PROD = 'PROD'

// 当前环境
const ENV = HOST === 'localhost:8080' ? DEV : PROD

// 基础地址
const BASE_URL = ENV === DEV ? 'http://localhost:3002' : 'https://www.xiaodao7887.com'

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
  BASE_URL,
  API_URL,
  PAGE_SIZE,
  TITLE
}
