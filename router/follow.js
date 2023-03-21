const express = require('express');
const Follow = require('../schema/Follow');

const dotenv = require("dotenv")
const router = express.Router()

dotenv.config({ path: "../config.env" })

router.get("/", async (req, res) => {
    // console.log(req.query.id_User)
    const follow = await Follow.findOne({ "id_User": `${req.query.id_User}` }).sort({ registration_data: -1 }).limit(1).catch(error => {
        return res.status(400).json({ msg: 'Dont connect or error user' })
    })
    if (!follow) {
        return res.status(400).json({ msg: 'Dont connect or error user' })
    }
    return res.status(200).json({ follow })
})

module.exports = router;