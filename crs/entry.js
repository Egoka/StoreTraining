const {Router} = require('express')
const User = require('../models/user')
const router = Router()
router.get('/login',(req, res) => {
    res.render('entry/login', {
        title: 'Авторизация',
        isLogin: true
    })
})
router.post('/login',async (req, res) => {
    req.session.user = await User.findById('5f8c487ab6096b2384a32a38')
    req.session.isAuthenticated = true
    req.session.save(err=>{
        if (err) throw err
        res.redirect('/')
    })
})
router.get('/logout',async (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/entry/login#login')
    })
})
module.exports = router