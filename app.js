const express = require('express');
const Controller = require('./controllers/controller');
const session = require('express-session')
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

// const isAdmin = function (req, res, next) {
//   console.log(req.session);
//   if (req.session.role === 'admin' || req.session.userName === 'admin) {
//     res.redirect(`/homeAdmin`)
//   } else {
//     next
//   }
// }

app.get('/register', Controller.userForm)

app.post('/register', Controller.userPost)

app.get('/login', Controller.login)

app.post('/login', Controller.postLogin)

app.use((req, res, next) => {
  console.log(req.session);
  if (!req.session.UserId) {
    const error = 'Login dulu dong ah'
    res.redirect(`/login?error=${error}`)
  } else {
    next()
  }
})

app.get('/home/:UserId', (req, res) => {
  res.send('hello world')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})