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
    try {
        const {email,password} = req.body
        const candidate = await User.findOne({email})
        if(candidate){
            if(password === candidate.password){
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err=>{
                    if (err) throw err
                    res.redirect('/')
                })
            }else{
                res.redirect('/entry/login#login')
            }
        }else{
            res.redirect('/entry/login#login')
        }
    }catch (err) {
        console.log(err)
    }

})
router.get('/logout',async (req, res) => {
    req.session.destroy(()=>{
        res.redirect('/entry/login#login')
    })
})
router.post('/registration', async (req, res)=>{
    try{
        const {name, email, password, confirm} = req.body
        if (await User.findOne({email})){
            res.redirect('/entry/login#registration')
        }else{
            const user = new User({
                name, email, password, basket:{items:[]}
            })
            await user.save()
            res.redirect('/entry/login#login')
        }
    }catch(err){
        console.log(err)
    }
})
module.exports = router