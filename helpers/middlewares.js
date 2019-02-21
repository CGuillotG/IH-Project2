exports.isLogged = (req,res,next) => {
    if(req.isAuthenticated()) return next()
    return res.redirect("/login")
  }

exports.isSeller = (req,res,next) => {
    if(req.user.isSeller) next()
    else res.redirect('/profile/becomeSeller')
}
