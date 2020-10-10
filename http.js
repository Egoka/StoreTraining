const http = require('http')
const server = http.createServer((request,response)=>{
    if (request.method==='GET'){
    }
    else if (request.method === 'POST'){
    }
})
server.listen(3000,()=>{
    console.log('Server has been started')
})
