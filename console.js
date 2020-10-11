function consoleToJSON(){
    const massage = {}
    for (let i=2; i<process.argv.length; i++){
        const arg = process.argv[i].split('=')
        massage[arg[0]] = arg[1] ? arg[1] : true
    }
    return massage
}
console.log(consoleToJSON())