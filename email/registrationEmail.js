const {EMAIL_FROM,URL_APPLICATION} = require('../keys/password')
module.exports = function(name, email, token){
    const RESET_URL = `${URL_APPLICATION}/entry/login/${token}`
    return {
        to: email,
        from:EMAIL_FROM,
        subject:'Аккаунт создан',
        html:`
        <h1>${name} добро пожаловать в магазин</h1>
        <p>Вы успешно зарегистрированы  в магазине</p>
        <p>Перейдите по ссылке, чтобы подтвердить аккаунт</p>
        <a href="${RESET_URL}">Подтвердить</a>
        `
    }
}