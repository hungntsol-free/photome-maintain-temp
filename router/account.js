const express = require('express')
const User = require('../schema/User');
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

const router = express.Router()

dotenv.config({ path: "../config.env" })

router.get('/:id', (req, res, next) => {
    const id = req.params.id
    console.log(id)
    User.findById(id, {

    })
        .then(data => {
            res.json(data)
        })
        .catch(err => console.log(err))
})

module.exports = router;
