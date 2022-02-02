const { Feedback, User, Voicefile, Homework, Class } = require('../models')

const feedbackController = {
  getFeedbacks: (req, res) => {
    return Voicefile.findByPk(req.params.id, {
      include: [
        User,
        { model: Feedback, include: [User] },
        { model: Homework, include: [Class] }
      ]
    })
      .then((voicefile) => {
        return res.render('feedbacks', {
          layout: 'main',
          voicefile: voicefile.toJSON(),
          currentUser: req.user
        })
      })
  },
  postFeedback: (req, res) => {
    const { ranking, feedback } = req.body
    if (!feedback) {
      req.flash('error_messages', '回饋欄不能空白')
      return res.redirect('back')
    }
    return Feedback.create({
      feedback: feedback,
      isMentor: false,
      VoicefileId: req.params.id,
      UserId: req.user.id
    })
      .then(() => {
        req.flash('success_messages', '已經送出回饋')
        return res.redirect('back')
      })    
     
  },
  editFeedback: (req, res) => {
    return Feedback.findByPk(req.params.id, {
      include: [User,
        { model: Voicefile, include: [Homework, User] }
      ]
    })
      .then((feedback) => {
        if (feedback.UserId !== req.user.id) {
          req.flash('error_messages', '您不是發布人，無法進行此操作')
          return res.redirect(`/classes/${feedback.Voicefile.ClassId}/homeworks/${feedback.Voicefile.Homework.id}/voicefiles/${feedback.Voicefile.id}/feedbacks`)
        }
        return res.render('editFeedback', { feedback: feedback.toJSON()})
      })
  },
  putFeedback: (req, res) => {
    if (!req.body.feedback) {
      req.flash('error_messages', '回饋欄必須填寫')
      return res.redirect('back')
    }
    const { feedback } = req.body
    return Feedback.findByPk(req.params.id, {
      include: [User,
        { model: Voicefile, include: [Homework, User] }
      ]
    })
      .then((feedback) => {
        if (feedback.UserId !== req.user.id) {
          req.flash('error_messages', '您不是發布人，無法進行此操作')
          return res.redirect(`/classes/${feedback.Voicefile.ClassId}/homeworks/${feedback.Voicefile.Homework.id}/voicefiles/${feedback.Voicefile.id}/feedbacks`)
        }
        return feedback.update({
          feedback: req.body.feedback
        })
          .then(() => {
            req.flash('success_messages', '回饋修改成功')
            return res.redirect(`/classes/${feedback.Voicefile.ClassId}/homeworks/${feedback.Voicefile.Homework.id}/voicefiles/${feedback.Voicefile.id}/feedbacks`)
          })
      })
  },
  deleteFeedback: (req, res) => {
    return Feedback.findByPk(req.params.id).then((feedback) => {
      if (feedback.UserId !== req.user.id) {
        req.flash('error_messages', '您不是發布人，無法進行此操作')
        return res.redirect('back')
      }
      return feedback.destroy().then(() => {    
        req.flash('success_messages', '已經成功刪除回饋')
        return res.redirect('back')
      })
    })
  },
  getAdminFeedbacks: (req, res) => {
    return Voicefile.findByPk(req.params.id, {
      include: [
        User,
        { model: Feedback, include: [User] },
        { model: Homework, include: [Class] }
      ]
    })
      .then((voicefile) => {
        return res.render('admin/feedback', {
          layout: 'admin',
          voicefile: voicefile.toJSON(),
          currentUser: req.user
        })
      })
  },
  postAdminFeedback: (req, res) => {
    const { ranking, feedback } = req.body
    if (!ranking) {
      req.flash('error_messages', '必須選擇星星數')
      return res.redirect('back')
    }
    if (!feedback) {
      req.flash('error_messages', '回饋欄不能空白')
      return res.redirect('back')
    }

    return Voicefile.findByPk(req.params.id)
      .then((voicefile) => {
        return voicefile.update({ isFeedbackedBy: req.user.id })
          .then(() => {
            return Feedback.create({
              feedback: feedback,
              isMentor: false,
              ranking: ranking,
              VoicefileId: req.params.id,
              UserId: req.user.id,     
            })
              .then(() => {
                req.flash('success_messages', '已經送出點評回饋')
                return res.redirect('back')
              })
          })     
      }) 
  },
  editAdminFeedback: (req, res) => {
    return Feedback.findByPk(req.params.id, {
      include: [User,
        { model: Voicefile, include: [Homework, User] }
      ]
    })
      .then((feedback) => {
        if (feedback.UserId !== req.user.id) {
          req.flash('error_messages', '您不是發布人，無法進行此操作')
          return res.redirect(`/classes/${feedback.Voicefile.ClassId}/homeworks/${feedback.Voicefile.Homework.id}/voicefiles/${feedback.Voicefile.id}/feedbacks`)
        }
        return res.render('admin/editFeedback', {
          layout: 'admin',
          feedback: feedback.toJSON(),
        })
      })
  },
  putAdminFeedback: (req, res) => {
    const { feedback } = req.body
    if (!req.body.feedback) {
      req.flash('error_messages', '回饋欄必須填寫')
      return res.redirect('back')
    }
    if (!req.body.ranking) {
      req.flash('error_messages', '星星數必須勾選')
      return res.redirect('back')
    }
    return Feedback.findByPk(req.params.id, {
      include: [
        User,
        { model: Voicefile, include: [Homework, User] }
      ]
    })
      .then((feedback) => {
        if (feedback.UserId !== req.user.id) {
          req.flash('error_messages', '您不是發布人，無法進行此操作')
          return res.redirect(`/classes/${feedback.Voicefile.ClassId}/homeworks/${feedback.Voicefile.Homework.id}/voicefiles/${feedback.Voicefile.id}/feedbacks`)
        }
        return feedback.update({
          feedback: req.body.feedback,
          ranking: req.body.ranking
        })
          .then(() => {
            req.flash('success_messages', '回饋修改成功')
            return res.redirect(`/admin/voicefiles/${feedback.Voicefile.id}/feedbacks`)
          })
      })
  },
}

module.exports = feedbackController