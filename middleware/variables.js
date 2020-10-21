module.exports = function (req,res,next) {
    res.locals.isEntry = req.session.isAuthenticated
    res.locals.emailError = req.session.emailError
    res.locals.passwordError = req.session.passwordError
    res.locals.emailErr = req.session.emailErr
    res.locals.passwordErr = req.session.passwordErr
    res.locals.csrf = req.csrfToken()
    next()
}