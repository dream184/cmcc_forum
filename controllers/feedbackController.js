const db = require('../models')
const Feedback = db.Feedback
const User = db.User
const VoiceFile = db.Voicefile
const Homework = db.Homework
const Class = db.Class

const feedbackController = {
  getFeedbacks: (req, res) => {
    return VoiceFile.findByPk(req.params.id, {
      include: [
        User,
        { model: Feedback, include: [User] },
        { model: Homework, include: [Class] }
      ]
    })
      .then((voicefile) => {
        console.log(voicefile.Feedbacks)
        return res.render('feedbacks', {
          layout: 'main',
          voicefile: voicefile.toJSON()
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
        { model: VoiceFile, include: [Homework, User] }
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
    const { feedback } = req.body
    return Feedback.findByPk(req.params.id, {
      include: [User,
        { model: VoiceFile, include: [Homework, User] }
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
            return res.redirect(`/classes/${feedback.Voicefile.ClassId}/homeworks/${feedback.Voicefile.Homework.id}/voicefiles/${feedback.Voicefile.id}/feedbacks`)
          })
      })
  },
  deleteFeedback: (req, res) => {
    if (feedback.UserId !== req.user.id) {
      req.flash('error_messages', '您不是發布人，無法進行此操作')
      return res.redirect(`/classes/${feedback.Voicefile.ClassId}/homeworks/${feedback.Voicefile.Homework.id}/voicefiles/${feedback.Voicefile.id}/feedbacks`)
    }
    return Feedback.findByPk(req.params.id)
      .then((feedback) => {
        feedback.destroy()
          .then(() => {
            req.flash('success_messages', '已經成功刪除回饋')
            return res.redirect('back')
          })
      })
  },
  getAdminFeedbacks: (req, res) => {
    return VoiceFile.findByPk(req.params.id, {
      include: [
        User,
        { model: Feedback, include: [User] },
        { model: Homework, include: [Class] }
      ]
    })
      .then((voicefile) => {
        console.log(voicefile.toJSON())
        return res.render('admin/feedback', {
          layout: 'admin',
          voicefile: voicefile.toJSON()
        })
      })
  },
  postAdminFeedback: (req, res) => {
    const { ranking, feedback } = req.body
    console.log(req.params.id)
    if (!ranking) {
      req.flash('error_messages', '必須選擇星星數')
      return res.redirect('back')
    }
    if (!feedback) {
      req.flash('error_messages', '回饋欄不能空白')
      return res.redirect('back')
    }
    return Feedback.create({
      feedback: feedback,
      isMentor: false,
      ranking: ranking,
      VoicefileId: req.params.id,
      UserId: req.user.id
    })
      .then(() => {
        req.flash('success_messages', '已經送出點評回饋')
        return res.redirect('back')
      })
  }
}

module.exports = feedbackController