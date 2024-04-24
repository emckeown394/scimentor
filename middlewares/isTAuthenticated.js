function isTAuthenticated(req, res, next) {
    if (req.session.loggedin) {
      next();
    } else {
      // If the user is not authenticated, redirect to the login page
      res.redirect('/teacher_login');
    }
  }

  module.exports = isTAuthenticated;