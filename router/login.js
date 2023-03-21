const express = require('express');
const User = require('../schema/User');
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const router = express.Router()
const auth = require("../middleware/auth")

dotenv.config({ path: "../config.env" })

router.post("/", (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ err: 'Enter all fields' })
    }
    User.findOne({ email }).then(user => {
        if (!user)
            return res.status(400).json({ msg: 'Email or Password incorrect' })
        bcryptjs.compare(password, user.password).then((isMatch) => {
            if (!isMatch)
                return res.status(400).json({ msg: 'Invalid credentials' })
            jwt.sign({ id: user.id }, process.env.secret, { expiresIn: "1000d" }, (err, token) => {
                if (err)
                    throw err
                res.status(200).json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    }
                })
            })
        })
    })
    //
    // console.log(`Login success! ${req.body}`)
})

router.get("/user", auth, (req, res) => {
    User.findById(req.PhoToUser.id)
        .select("-password")
        .then((user) => res.status(200).json(user))
})

module.exports = router;
