const http = require('http')
const path = require('path')
const fs = require('fs')

const server = http.createServer((request,response)=>{
    if (request.method==='GET'){
        response.writeHead(200, {'Content-Type': `text/html; charset=utf-8`})
        if (request.url === '/'){
            fs.readFile(path.join(__dirname,'views', 'index.html'),
                'utf-8',
                (err, content) =>{
                if (err){throw err}
                response.end(content)
                })
        }else if (request.url === '/about.html'){
            fs.readFile(path.join(__dirname,'views', 'about.html'),
                'utf-8',
                (err, content) =>{
                    if (err){throw err}
                    response.end(content)
                })
        }else if (request.url === '/api/users'){
            response.writeHead(200,{'Content-Type': 'text/json'})
            const users = [{name: 'Egor', age: 23},{name: 'Elena', age: 24}]
            response.end(JSON.stringify(users))
        }
    }
    else if (request.method === 'POST'){
        response.writeHead(200, {'Content-Type': `text/html; charset=utf-8`})
        const body = []
        request.on('data', data => {
            body.push(Buffer.from(data))
        })
        request.on('end',()=>{
            console.log(body.toString())
            const massage = body.toString().split('=')[1]
            response.write(`<h2>Ваше сообщение: ${massage}</h2>`)
            response.end()
        })
    }
})
server.listen(3000,()=>{
    console.log('Server has been started')
})
