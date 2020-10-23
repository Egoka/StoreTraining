const {Router} = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const {body, validationResult} = require('express-validator')
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
        isLogin: true,
        name: req.flash('name'),
        email: req.flash('email'),
        loginEmailError: req.flash('loginEmailError'),
        loginPasswordError: req.flash('loginPasswordError'),
        registerEmailError: req.flash('registerEmailError'),
        registerPasswordError: req.flash('registerPasswordError')
    })
})
router.post('/login',async (req, res) => {
    try {
        const {email,password} = req.body
        const candidate = await User.findOne({email})
        if(candidate){
            if(await bcrypt.compare(password,candidate.password)){
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err=>{
                    if (err) throw err
                    res.redirect('/')
                })
            }else{
                req.flash('loginPasswordError', 'Неверный пароль')
                req.flash('email',email)
                res.redirect('/entry/login#login')
            }
        }else{
            req.flash('loginEmailError', 'Неверный email')
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
router.post('/registration', body('email').isEmail(), async (req, res)=>{
    try{
        const {name, email, password, confirm} = req.body
        req.flash('name',name)
        const error = validationResult(req)
        if(!error.isEmpty()){
            req.flash('registerEmailError', 'Несуществующий email')
            return res.status(422).redirect('/entry/login#registration')
        }
        if (await User.findOne({email})){
            req.flash('email',email)
            req.flash('registerEmailError', 'Вы уже зарегестрированы')
            return res.redirect('/entry/reset')
        }else{
            if (password !== confirm){
                req.flash('email',email)
                req.flash('registerPasswordError', 'Пароль не совпадает')
                res.redirect('/entry/login#registration')
            }else{
                const user = new User({
                    name, email, password:await bcrypt.hash(password,10), basket:{items:[]}
                })
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
        error: req.flash('error'),
        email: req.flash('email'),
        loginEmailError: req.flash('loginEmailError'),
        registerEmailError: req.flash('registerEmailError')
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
router.get('/password/:token',async(req,res) =>{
    if(!req.params.token) res.redirect('/entry/login')
    try{
        const user = await User.findOne({
            resetToken: req.params.token,
            resetDate: {$gt:Date.now()}
        })
        if(!user) {
            req.flash('registerEmailError', 'Время действия ссылки истекло')
            res.redirect('/entry/reset')
        }else{
            res.render('entry/password',{
                title: 'Восстановить доступ',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token,
                registerPasswordError: req.flash('registerPasswordError')
            })
        }
    }catch(err){
        console.log(err)
    }
})
router.post('/password', async(req,res)=>{
    try{
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetDate: {$gt: Date.now()}
        })
        if(user){
            if(req.body.password ===req.body.confirm) {
                user.password = await bcrypt.hash(req.body.password, 10)
                user.resetToken = undefined
                user.resetDate = undefined
                await user.save()
                res.redirect('/entry/login')
            }else {
                req.flash('registerPasswordError', 'Пароль не совпадает')
                res.redirect(`/entry/password/${user.resetToken}`)
            }
        }else{
            req.flash('error', 'Время действия ссылки истекло')
            res.redirect('/entry/login')
        }
    }catch(err){
        console.log(err)
    }
})
module.exports = router