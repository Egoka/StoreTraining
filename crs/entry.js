const {Router} = require('express')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const User = require('../models/user')
const regEmail = require('../email/registrationEmail')
const {SEND_GRID_API_KEY} = require('../password')
const router = Router()

const transporter = nodemailer.createTransport(sendgrid({
    auth:{api_key:SEND_GRID_API_KEY}
}))

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
            if(await bcrypt.compare(password,candidate.password)){
                req.session.user = candidate
                req.session.emailError = false
                req.session.passwordError = false
                req.session.isAuthenticated = true
                req.session.save(err=>{
                    if (err) throw err
                    res.redirect('/')
                })
            }else{
                req.session.passwordError = true
                res.redirect('/entry/login#login')
            }
        }else{
            req.session.emailError = true
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
            req.session.emailErr = true
            req.session.passwordErr = password !== confirm;
            res.redirect('/entry/login#registration')
        }else{
            if (password !== confirm){
                req.session.passwordErr = true
                res.redirect('/entry/login#registration')
            }else{
                const user = new User({
                    name, email, password:await bcrypt.hash(password,10), basket:{items:[]}
                })
                req.session.passwordErr = false
                req.session.emailErr = false
                await user.save()
                res.redirect('/entry/login#login')
                await transporter.sendMail(regEmail(name, email))
            }
        }
    }catch(err){
        console.log(err)
    }
})
module.exports = router