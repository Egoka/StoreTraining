const {Router} = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const User = require('../models/user')
const regEmail = require('../email/registrationEmail')
const resetPassword = require('../email/resetPassword')
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
            res.redirect('/entry/reset')
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
router.get('/reset',(req,res) =>{
    res.render('entry/reset',{
        title:'Сброс пароля',
        error: req.flash('error')
    })
})
router.post('/reset',(req,res)=>{
    try{
        crypto.randomBytes(32,async(err, buffer)=>{
            if (err) {
                req.flash('error','Что-то пошло не так, повторите попытку')
                return res.redirect('/entry/reset')
            }
            const token = buffer.toString('hex')
            const candidate = await User.findOne({email:req.body.email})
            if (candidate){
                candidate.resetToken = token
                candidate.resetDate = Date.now()+60 * 60 * 1000 // one hour
                await candidate.save()
                await transporter.sendMail(resetPassword(candidate.name,candidate.email,token))
                req.session.destroy()
                res.redirect('/entry/login')
            }else{
                req.flash('error', 'Такого email нет. Зарегестрируйтесь.')
                res.redirect('/entry/reset')
            }
        })
    }catch(err){
        console.log(err)
    }
})
module.exports = router