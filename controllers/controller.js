const { User, Comic, Profile } = require('../models')
const bcrypt = require('bcryptjs')
const Op = require('sequelize');

class Controller {
  static homeAdmin(req, res) {
    let search = req.query.search
    let sort = req.query.sort

    let obj = {
      include: User
    }

    if (search) {
      obj.where = {
        title: {
          [Op.substring]: `${search}`
        }
      }
    }
    if (sort) {
      obj.order = Comic.sorting(sort)
    }

    Comic.findAll(obj)
      .then(data => {
        res.render('homeAdmin', { data })
      })
      .catch(err => {
        console.log(err)
        res.send(err)
      })
  }

  static homeUser(req, res) {
    res.render('home')
  }

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
        res.redirect('/profile')
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

  static profileForm(req, res) {
    res.render('formProfile', { errors: {} })
  }

  static profilePost(req, res) {
    // console.log(req.body);
    const { firstName, lastName, address } = req.body
    let userId;
    User.findAll({
      order: [['id', 'DESC']]
    })
      .then(data => {
        userId = data[0].id
        console.log(userId);
        return Profile.create({
          firstName, lastName, address
        })
      })
      .then(() => {
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
          return res.render('formProfile', { errors })
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
            req.session.userName = user.userName
            req.session.UserId = user.id
            req.session.role = user.role
            // console.log(user.role, user.userName);
            if (user.role === 'admin') {
              return res.redirect('/comics/admin')
            } else {
              return res.redirect(`/comics/user/${user.id}`)
            }
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

  static updateStock(req, res) {
    let id = req.params.id
    let stockUpdate = req.query.stock
    Comic.update({ stock: stockUpdate }, {
      where: {
        id: id
      }
    })
      .then(() => {
        res.redirect('/comics/admin')
      })
      .catch(err => {
        console.log(err)
        res.send(err)
      })
  }

  static deleteComic(req, res) {
    let id = req.params.id
    Comic.destroy({
      where: {
        id: id
      }
    })
      .then(() => {
        res.redirect('/comics/admin')
      })
      .catch(err => {
        console.log(err)
        res.send(err)
      })
  }

  static logout(req, res) {
    req.session.destroy(err => {
      if (err) res.send(err);
      else {
        res.redirect('/login')
      }
    })
  }
}

module.exports = Controller