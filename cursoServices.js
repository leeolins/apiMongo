const mongoose = require('mongoose')
const db = require('./db')
const user = require('./dbUser')


const cursoDb = mongoose.model('Curso', db)
const userDb = mongoose.model('User', user)


class CursoServices{

    async Add(name, amount, email){
        const cursoModel = new cursoDb({
            name: name,
            amount: amount,
            emailOwner: email
        })
    
        try {
            await cursoModel.save()
            return true
        } catch (error) {
            console.log(error)
            return false
        }        
    }

    async Find(email){
        try {
        var cursos = await cursoDb.find({emailOwner: email})
        console.log(cursos)
        return cursos
        } catch (error) {
            console.log(error)
        }        
    }

    async RemoveId(id){
       
       try {
            var cursos = await cursoDb.findByIdAndRemove(id)
            console.log('que isso ' + cursos)            
            return true
       } catch (error) {
           console.log(error)
           return false
       }
    }

    async Update(course){
        try {
            const result = await cursoDb.findOneAndUpdate({_id:course.id}, {name: course.name, amount: course.amount, email: course.email})
            return true
        } catch (error) {
            console.log(error)
        }       
    }


    async FindUser(email){
        try {
        var user = await userDb.find({emailOwner: email})
        console.log(user)
        return user
        } catch (error) {
            console.log(error)
        }        
    }

}

module.exports = new CursoServices()