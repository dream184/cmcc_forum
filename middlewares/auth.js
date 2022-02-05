const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/user/signin')
}

const authenticatedMentorAndAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    const mentorId = 3
    const adminId = 4
    if (req.user.AuthorityId === mentorId || req.user.AuthorityId === adminId) {
      return next()
    }
    req.flash('error_messages', '您沒有權限進行此操作!')
    res.redirect('/admin/voicefiles')
  }
  res.redirect('/user/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    const adminId = 4
    if (req.user.AuthorityId === adminId) {
      return next()
    }
    req.flash('error_messages', '您沒有權限進行此操作!')
    res.redirect('/admin/voicefiles')
  }
  res.redirect('/user/signin')
}

module.exports = {
  authenticated,
  authenticatedMentorAndAdmin,
  authenticatedAdmin
}