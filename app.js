const express = require('express');
const Controller = require('./controllers/controller');
const session = require('express-session');
const { is } = require('express/lib/request');
const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    sameSite: true
  }
}))

const isLoggedIn = function (req, res, next) {
  if (!req.session.UserId) {
    const error = 'You have to be login first'
    res.redirect(`/login?error=${error}`)
  } else {
    next()
  }
}

const isAdmin = function (req, res, next) {
  console.log(req.session.role);
  if (req.session.role === 'admin') {
    res.redirect('/comics/admin')
  } else {
    next()
  }
}

app.get('/register', Controller.userForm)

app.post('/register', Controller.userPost)

app.get('/profile', Controller.profileForm)

app.post('/profile', Controller.profilePost)

app.get('/login', Controller.login)

app.post('/login', Controller.postLogin)

app.use(isLoggedIn)

app.use('/profileUser', Controller.userProfile)

app.get('/comics/admin', Controller.homeAdmin)

app.get('/comics/user/:UserId', isAdmin, Controller.homeUser)

app.post('/comics/user/buy/:idComic/:idUser', Controller.buyComic)

app.get('/comics/admin/updateStock/:id', Controller.updateStock)

app.get('/comics/admin/delete/:id', Controller.deleteComic)

app.get('/logout', Controller.logout)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

