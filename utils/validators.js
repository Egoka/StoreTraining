const {body} = require('express-validator')

exports.productsValidators = [
    body('title').isLength({min:3}).withMessage('Минимальная длина названия 3 символа.').trim(),
    body('price').isNumeric().withMessage('Введите корректную цену'),
    body('img').isURL().withMessage('Введите корректный URL картинки')
]
