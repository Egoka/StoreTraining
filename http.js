const http = require('http')
const server = http.createServer((request,response)=>{
    if (request.method==='GET'){
        response.writeHead(200, {'Content-Type': `text/html`})
        response.write(`
        <h1>Form</h1>
        <form method="post" action="/">
            <input name="title" type="text"/>
            <button type="submit">Send</button>
        </form>
        `)
        response.end()
    }
    else if (request.method === 'POST'){
    }
})
server.listen(3000,()=>{
    console.log('Server has been started')
})
