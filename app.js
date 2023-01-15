// @ts-check
const express = require('express')
const { Sequelize, DataTypes, Model } = require('sequelize');
const app = express()
const validator = require('validator').default;
const cors = require('cors')
const { createToken, verifyToken, createPasswordHash, comparePassword } = require('./auth-service')
const path = require('path')

const port = process.env.PORT || 3000

const sequelize = new Sequelize('sqlite:mydb.sqlite3', {
    dialect: 'sqlite',
    storage: './data/db.sqlite3'
});

class JobOrder extends Model { }
class Admin extends Model { }

function stringType() {
    return {
        type: DataTypes.STRING,
        allowNull: false
    }
}

JobOrder.init({
    firstName: stringType(),
    lastName: stringType(),
    phone: stringType(),
    email: stringType(),
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
}, {
    modelName: 'JobOrder',
    sequelize
})

Admin.init({
    name: stringType(),
    password: stringType(),
}, {
    modelName: 'Admin',
    sequelize
})

start()

async function start() {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('Successful db connection');
        startApp()
    } catch (error) {
        console.error(error)
    }
}

function startApp() {
    app.use(cors())
    app.use(express.json())

    //Uncomment it if admin registration is required
    /*
    app.post('/api/admin', async function (req, res) {
         const passwordHash = createPasswordHash(req.body.password)
         const newAdmin = await Admin.create({
             name: req.body.name,
             password: passwordHash
         })
         res.send(newAdmin)
    })
    */

    app.post('/api/login', async function (req, res) {
        const userFromDB = await Admin.findOne({ where: { name: req.body.name } })
        // @ts-ignore
        if (comparePassword(req.body.password, userFromDB.password)) {
            const token = createToken(userFromDB)
            res.send({
                token
            })
        } else {
            res.status(403).send({
                message: 'Wrong password'
            })
        }
    })

    app.get('/api/joborder', verifyToken, async function (req, res) {
        const orders = await JobOrder.findAll()
        res.send(orders)
    })

    app.post('/api/joborder', async function (req, res) {
        const orderInfo = req.body
        let validationError = []

        console.log(orderInfo);
        
        if (!validator.isMobilePhone(orderInfo.phone.replace(/\D/g, ''), ['ru-RU']))
            validationError.push('Wrong phone number')
        if (!validator.isLength(orderInfo.firstName, { min: 2, max: 20 }))
            validationError.push('Wrong first name')
        if (!validator.isLength(orderInfo.lastName, { min: 2, max: 40 }))
            validationError.push('Wrong last name')
        if (!validator.isEmail(orderInfo.email))
            validationError.push('Wrong email')
        if (!validator.isLength(orderInfo.message, { min: 0, max: 10000 }))
            validationError.push('Wrong message')

        if (validationError.length) {
            res.status(400).send({ messages: validationError })
        } else {
            const orderFromDB = await JobOrder.create(orderInfo)
            res.send(orderFromDB)
        }
    })

    app.use(express.static(path.join(__dirname, 'static')))
    app.use(express.static(path.join(__dirname, 'static'),{index:false,extensions:['html']}));

    app.listen(port, function () {
        console.log('Server started at http://localhost:' + port);
    })
}