const { Like, Voicefile } = require('../models')

const likeController = {
  addLike: (req, res) => {
    const voicefileId = req.params.id
    return Like.findOne({
      where: {
        VoicefileId: voicefileId,
        UserId: req.user.id
      }
    }).then((like) => {
      if (like) {
        req.flash('error_messages', '已經點過讚')
        return res.redirect('back')
      }
      return Like.create({
        VoicefileId: voicefileId,
        UserId: req.user.id
      }).then((like) => {    
        return Voicefile.findByPk(voicefileId).then((voicefile) => {
          return voicefile.update({ likeCount: voicefile.likeCount + 1 }).then((result) => {
            req.flash('success_messages', '已成功按讚')
            return res.redirect('back')
          }) 
        })
      })
    })
    .catch(err => console.log(err))
  },
  removeLike: (req, res) => {
    const voicefileId = req.params.id
    return Like.findOne({
      where: {
        VoicefileId: voicefileId,
        UserId: req.user.id
      }
    }).then((like) => {
      return like.destroy().then(() => {
        return Voicefile.findByPk(voicefileId).then((voicefile) => {
          return voicefile.update({ likeCount: voicefile.likeCount - 1 }).then((result) => {
            req.flash('success_messages', '已成功收回讚')
            return res.redirect('back')
          }) 
        })  
      })
    })
    .catch((err) => console.log(err))
  }
}

module.exports = likeController