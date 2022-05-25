const {Comic, Profile, User} = require('../models')
const {Op} = require('sequelize')

class Controller {
    static home(req, res) {
        let search = req.query.search
        let sort = req.query.sort

        let obj = {
            include: User
        }

        if (search) {
            obj.where = {
                title: {
                    [Op.substring]: search
                }
            }
        }
        if (sort) {
            obj.order = Comic.sorting(sort)
        }
        console.log(search, sort)
        console.log(obj, 1111)

        Comic.findAll(obj)
        .then(data => {
            // console.log(data)
            res.render('home', {data})
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
    }
    static showProfile(req, res) {
        let id = req.params.id
        Profile.findByPk(id)
            .then(data => {
                // console.log(data)
                res.render('profile', {data})
            })
            .catch(err => {
                console.log(err)
                res.send(err)
            })
    }
    static updateStock(req, res) {
        let id = req.params.id
        let stockUpdate = req.query.stock
        console.log(1111)
        Comic.update({stock: stockUpdate}, {
            where: {
                id: id
            }
        })
        .then(() => {
            res.redirect('/comics')
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
            res.redirect('/comics')
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
    }
}

module.exports = Controller