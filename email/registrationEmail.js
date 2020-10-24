const {EMAIL_FROM,URL_APPLICATION} = require('../keys/password')
module.exports = function(name, email){
    return {
        to: email,
        from:EMAIL_FROM,
        subject:'Аккаунт создан',
        html:`
        <h1>${name} добро пожаловать в магазин</h1>
        <p>Вы успешно зарегистрированы  в магазине</p>
        <hr/>
        <a href="${URL_APPLICATION}">В магазин</a>
        `
    }
}