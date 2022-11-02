function requireUser(req, res, next){
  if (!req.user){
    next({
      name: "missingUserError",
      message: "You must be logged in to preform this action"
    });
  }
  next()
}
function requireActiveUser(req, res, next){
  if (!req.user.active){
    next({
      name: "notActive",
      message: "You must be an active User"
    });
  }
  next()
}

module.exports = {
  requireUser, requireActiveUser
}
