const {EMAIL_FROM,URL_APPLICATION} = require('../password')
module.exports = function(name, email,token){
    const RESET_URL = `${URL_APPLICATION}/entry/password/${token}`
    return {
        to: email,
        from:EMAIL_FROM,
        subject:'Восстановление аккаунта',
        html:`
        <h1>Здравствуйте ${name}.</h1>
        <p>Это письмо пришло вам, потому что на сайте магазина было запрошено восстановление пароля по этой почте ${email}.</p>
        <p>Если это сделали не вы, то можете проигнорировать это письмо.</p>
        <p>Если же восстановление пароля сделано вами, то перейдите по этой <a href="${RESET_URL}">ссылке</a>.</p>
        <a href="${RESET_URL}">Восстановить</a>
        <hr/>
        <a href="${URL_APPLICATION}">В магазин</a>
        `
    }
}