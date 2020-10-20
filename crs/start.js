const {Router} = require('express')
const router = Router()
router.get('/',(req, res) => {
    res.render('index', {
        title: 'Стартовая страница',
        isStart: true
    })
})
module.exports = router