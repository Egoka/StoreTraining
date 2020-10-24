const {Router} = require('express')
const closedPage = require('../middleware/pageAccess')
const router = Router()
router.get('/', closedPage, async(req,res)=>{
    res.render('personalArea',{
        title:'Профиль',
        isArea: true,
        user: req.user.toObject()
    })
})
router.post('/', async(req,res)=>{})
module.exports = router