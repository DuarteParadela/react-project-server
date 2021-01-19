module.exports = function protectAdminRoute(req, res, next) {
  if (req.session.currentUser && req.session.currentUser.isAdmin === true)
    next();
  else res.redirect("/signin");
};
