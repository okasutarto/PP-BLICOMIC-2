const { User, Comic, Profile, User_Comic } = require('../models')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize');
const pictURL = require('pict-url');
const Imgur = pictURL.Provider.Imgur;
const Client = new pictURL.Client(Imgur);
const format = require('../helpers/formatter')

class Controller {
  static homeAdmin(req, res) {
    let search = req.query.search
    console.log(search);
    let sort = req.query.sort
    let err = req.query.err

    let obj = {
      include: User
    }

    if (search) {
      obj.where = {
        title: {
          [Op.iLike]: `%${search}%`
        }
      }
    }
    if (sort) {
      obj.order = Comic.sorting(sort)
    }

    Comic.findAll(obj)
      .then(data => {
        res.render('homeAdmin', { data, err , format})
      })
      .catch(err => {
        // console.log(err)
        res.send(err)
      })
  }

  static homeUser(req, res) {
    let search = req.query.search
    // console.log(search);
    let idUser = req.session.UserId
    let sort = req.query.sort

    let obj = {
      include: User
    }

    if (search) {
      obj.where = {
        title: {
          [Op.iLike]: `%${search}%`
        }
      }
    }
    if (sort) {
      obj.order = Comic.sorting(sort)
    }

    Comic.findAll(obj)
      .then(data => {
        res.render('homeUser', { data, format, idUser })
      })
      .catch(err => {
        console.log(err)
        res.send(err)
      })
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

    let category = "doggos";
    let avatar = "";

    Client.getImage(category)
      .then((image) => {
        avatar = image.url;
        return User.findAll({
          order: [['id', 'DESC']]
        })
      })
      .then(data => {
        userId = data[0].id
        // console.log(userId);
        return Profile.create({
          firstName, lastName, address, avatar
        })
      })
      .then(() => {
        return User.max('id')
      })
      .then(maxIdUser => {
        Profile.update({ UserId: maxIdUser }, {
          where: {
            UserId: null
          }
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
            const error = 'Invalid Password';
            return res.redirect(`/login?error=${error}`)
          }
        } else {
          const error2 = 'Invalid Username';
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
        if (err.name === 'SequelizeValidationError') {
          err = err.errors.map(el => el.message)
          res.redirect(`/comics/admin?err=${err}`)
        }
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

  static buyComic(req, res) {
    let totalBuy = req.body.totalBuy
    let idComic = req.params.idComic
    let idUser = req.params.idUser
    // console.log(totalBuy);
    // console.log(req.params);
    Comic.findByPk(idComic)
      .then(data => {
        let obj = {
          totalPurchased: totalBuy * data.price,
          UserId: idUser,
          ComicId: idComic
        }
        return User_Comic.create(obj)
      })
      .then(() => {
        return Comic.decrement({ stock: totalBuy }, {
          where: {
            id: idComic,
            stock: {
              [Op.gt]: 0
            }
          }
        })
      })
      .then(() => {
        res.redirect(`/comics/user/${idUser}`)
      })
      .catch(err => {
        console.log(err);
        res.send(err)
      })
  }

  static userProfile(req, res) {
    let id = req.session.UserId
    console.log(id);
    Profile.findByPk(id)
      .then(data => {
        console.log(data);
        res.render('profile', { data , id})
      })
      .catch(err => {
        res.send(err)
      })
  }
}

module.exports = Controller