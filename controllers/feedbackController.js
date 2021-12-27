const db = require('../models')
const Feedback = db.Feedback

const feedbackController = {
  
  postFeedback: (req, res) => {
    const { ranking, feedback } = req.body
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