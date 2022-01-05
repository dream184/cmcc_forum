const dayjs = require('dayjs')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw') 

module.exports = {
  dayjs: function (time) {
    return dayjs(time).format('YYYY/MM/DD HH:mm')
  },
  rankingStar: function (number) {
    const star = '<i class="fas fa-star text-warning"></i>'
    return star.repeat(number)
  },
  isAuthor: function (AuthorId, userId) {
    return AuthorId === userId
  },
  equal: function (a, b) {
    return a === b
  },
  includes: function (arr, element) {
    return arr.includes(element)
  }
}