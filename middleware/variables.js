module.exports = function (req,res,next) {
    res.locals.isEntry = req.session.isAuthenticated
    next()
}