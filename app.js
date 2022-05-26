const express = require('express')
const Controller = require('./controllers/controller')
const session = require('express-session')
const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'blicomic',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        sameSite: true
    }
}))

app.get('/register')
app.post('/register')
app.get('/login')
app.post('/login')
app.get('/logout')
app.get('/comics', Controller.home)

app.get('/comics/buy/:idComic/:idUser')
app.get('/profile/:id', Controller.showProfile)

app.get('/comics/updateStock/:id', Controller.updateStock)
app.get('/comics/delete/:id', Controller.deleteComic)

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})