const path = require('path')
const fs = require('fs')
const file = path.join(
    path.dirname(process.mainModule.filename),
    'crs','data',
    'pay.json'
)
class Pay{
    static async add(productOne){
        const pay = await Pay.fetch()
        const indexProduct = pay.products.findIndex(prod=>prod.id === productOne.id)
        if (pay.products[indexProduct]){
            pay.products[indexProduct].count+=1
        }else{
            productOne.count = 1
            pay.products.push(productOne)
        }
        pay.price += +productOne.price
        return new Promise((resolve, reject)=>{
            fs.writeFile(file,JSON.stringify(pay),err=>{
                if (err){
                    reject(err)
                }else{
                    resolve()
                }
            })
        })
    }
    static async remove(id){
        const pay = await Pay.fetch()
        const indexProduct = pay.products.findIndex(prod=>prod.id === id)
        const price = pay.products[indexProduct].price
        if(pay.products[indexProduct].count === 1){//delete
            pay.products = pay.products.filter(prod=>prod.id !== id)
        }else{//decrement
            pay.products[indexProduct].count-=1
        }
        pay.price -= price
        return new Promise((resolve, reject)=>{
            fs.writeFile(file,JSON.stringify(pay),err=>{
                if (err){
                    reject(err)
                }else{
                    resolve(pay)
                }
            })
        })
    }
    static async fetch(){
        return new Promise((resolve,reject) => {
            fs.readFile(file,'utf-8', (err,content)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(JSON.parse(content))
                }
            })
        })
    }
}
module.exports = Pay