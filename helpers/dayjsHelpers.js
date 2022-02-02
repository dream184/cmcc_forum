const dayjs = require('dayjs')
require('dayjs/locale/zh-tw')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.locale('zh-tw') 
dayjs.extend(utc)
dayjs.extend(timezone)

module.exports = { dayjs }