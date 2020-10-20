const {Router} = require('express')
const router = Router()
router.get('/login',(req, res) => {
    res.render('entry/login', {
        title: 'Авторизация',
        isLogin: true
    })
})
router.post('/login',async (req, res) => {
    req.session.isAuthenticated = true
    res.redirect('/')
})
router.get('/logout',async (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/entry/login#login')
    })
})
module.exports = router