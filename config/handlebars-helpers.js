const dayjs = require('dayjs')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw') 

module.exports = {
  dayjs: function (time) {
    return dayjs(time).format('YYYY/MM/DD HH:mm')
  }
}