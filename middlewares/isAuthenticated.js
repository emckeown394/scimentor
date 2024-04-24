function isAuthenticated(req, res, next) {
    if (req.session.loggedin) {
      next();
    } else {
      // If the user is not authenticated, redirect to the login page
      res.redirect('/login');
    }
  }

  module.exports = isAuthenticated;