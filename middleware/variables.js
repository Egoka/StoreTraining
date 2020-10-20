module.exports = function (req,res,next) {
    res.locals.isEntry = req.session.isAuthenticated
    res.locals.csrf = req.csrfToken()
    next()
}