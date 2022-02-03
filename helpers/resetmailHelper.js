const subject = 'cmcc-forum 重設密碼'
const mailContent = (email, token) => {
  return `
    <h1>cmcc-forum 密碼重設信</h1>
    <p>請使用此驗證信重設您的帳戶: ${email}</p>
    <p><a href="https://cmcc-forum.herokuapp.com/user/resetPassword?email=${email}&token=${token}">按此重設密碼</a></p>
    <p>請注意，如果超過五分鐘，則必須重新申請重設密碼</p>
  `
}
module.exports = { subject, mailContent }