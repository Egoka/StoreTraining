if (process.env.NODE_ENV==='production'){
    module.exports = require('./password-PROD')
}else{
    module.exports = require('./password-DEV')
}