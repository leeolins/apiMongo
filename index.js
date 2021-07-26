const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const db = require('./db')
const curso = require('./cursoServices')
const cors = require('cors')
const jwt = require('jsonwebtoken')

app.use(cors())

app.use(express.static('public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.connect('mongodb://localhost:27017/curso', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})

const secret = 'trivelinha'

function auth(req,res,next){
    const token = req.headers['authorization'] 

    if(token != undefined){
        jwt.verify(token, secret, (err, decoded) => {
            if(err){
                res.status(400)
                res.json({err: "Token invalido"})
            }
            //res.status(200)
            //res.json('Muito bem!')
            console.log(decoded)
            next()
        })
    }else{
        res.status(400)                
        res.json('Voce nao enviou a autorização')
    }
}

app.post('/credentials', async (req,res)=>{
    const {email, password} = req.body
    console.log(email)

    if(email != undefined && password != undefined){
        
        //const user = await curso.FindUser(email)

        const user = {
            id: 1,
            name: 'Leo',
            password: '123',
            emailOwner: 'leeolins@live.com'
        }

        console.log(user.password)

        if(user.password == password){
            //console.log("array:" + user)
            jwt.sign({userid: user.id}, secret, {expiresIn: '1h'},(err, token) =>{
                 if(err){
                     res.status(401)
                     res.json('Deu algum problema')
                 }else{
                    res.status(200)
                    res.json({token: token})
                 }   
            })
            
        }else{
            res.status(400)
            res.json("deu algum problema")
        }
    }else{
        res.status(401)
        res.json({message: 'faltou credencial'})
    }
})


app.post('/cursos', async (req,res) => {
    const {name, amount, email} = req.body

    var adddd = await curso.Add(name,amount,email)
    if (adddd) {
        res.sendStatus(200)
    }else{
        res.sendStatus(404)
    }
    
})

app.get('/cursos/:email',auth, async (req,res) => {
    var email = req.params.email    
    const emails = await curso.Find(email)

    const HATEAOS = [
        {
            url: 'http://localhost:2020/',
            method: 'GET',
            rel: 'get_curso_email'
        },
        {
            url: 'http://localhost:2020/cursos/1',
            method: 'DELETE',
            rel: 'delete_curso'
        }
    ]
    if(emails != undefined){
        res.status(200).send({emails, _links: HATEAOS})
        //res.sendStatus(200)
    }else{
        res.sendStatus(400)
    }
       
})

app.delete('/cursos/:id', async(req,res) => {
    var id = req.params.id
    const deleteCourse = await curso.RemoveId(id)
    if (deleteCourse) {
        res.status(200).send('Foi Cancelado com sucesso')
    }else{
        res.sendStatus(400)
    }


})

app.put('/cursos/:id', async(req,res) => {
    console.log("começou")
    const id = req.params.id
    const name = req.body.name
    const amount = req.body.amount
    const email = req.body.email

    console.log("o que tem aqui? " + amount)
    console.log("o que tem aqui? " + email)

    if(name == undefined){
        res.status(400).send('voce precisa enviar o nome')
    }

    if(amount == undefined){
        res.status(400).send('voce precisa enviar o valor')
    }

    if(email == undefined){
        res.status(400).send('voce precisa enviar o email')
    }

    const data = {
        id: id,
        name: name,
        amount: parseInt(amount),
        email: email
    }

    

    console.log(data)

    //console.log(data)

    const result = curso.Update(data)

    if(result){
        res.status(200).send('Foi alterado com sucesso')
    }else{
        res.sendStatus(400)
    }
    
})

app.get('/cursos', (req,res) => {
    res.send('tamo workando')    
})


app.listen('2020', () =>{
    console.log('tamo on')
})


