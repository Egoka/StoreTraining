const {Router} = require('express')
const closedPage = require('../middleware/pageAccess')
const User = require('../models/user')
const router = Router()
router.get('/', closedPage, async(req,res)=>{
    res.render('personalArea',{
        title:'Профиль',
        isArea: true,
        user: req.user.toObject()
    })
})
router.post('/', closedPage,async(req,res)=>{
    try{
        const user = await User.findById(req.user._id)
        const toChange = {
            name:req.body.name
        }
        if(req.file){
            toChange.avatarURL = req.file.path
        }
        Object.assign(user, toChange)
        await user.save()
        res.redirect('/personalArea')
    }catch (err) {
        console.log(err)
    }
})
module.exports = router