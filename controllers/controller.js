const { User, Comic, Profile } = require('../models')
const bcrypt = require('bcryptjs')

class Controller {
  static userForm(req, res) {
    res.render('register', { errors: {} })
  }

  static userPost(req, res) {
    // console.log(req.body);
    const { userName, email, password } = req.body
    User.create({
      userName, email, password
    })
      .then(data => {
        res.redirect('/login')
      })
      .catch(err => {
        if (err.name == 'SequelizeValidationError') {
          const errors = {}
          err.errors.forEach(el => {
            if (errors[el.path]) {
              errors[el.path].push(el.message)
            } else {
              errors[el.path] = [el.message]
            }
          })
          return res.render('register', { errors })
        }
        res.send(err)
      })
  }

  static login(req, res) {
    const { error } = req.query
    res.render('login', { error })
  }

  static postLogin(req, res) {

    const { userName, password } = req.body
    User.findOne({
      where: {
        userName: userName
      }
    })
      .then(user => {
        // console.log(user);
        if (user) {
          const isValidPassword = bcrypt.compareSync(password, user.password)

          if (isValidPassword) {
            //case berhasil login
            req.session.UserId = user.id
            req.session.role = user.role
            return res.redirect(`/home/${user.id}`)
          } else {
            const error = 'invalid password';
            return res.redirect(`/login?error=${error}`)
          }
        } else {
          const error2 = 'invalid username';
          return res.redirect(`/login?error=${error2}`)
        }
      })
      .catch(err => {
        res.send(err)
      })
  }
}

module.exports = Controller