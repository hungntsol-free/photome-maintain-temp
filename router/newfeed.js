const express = require('express');
const Newfeed = require('../schema/Newfeed');
const User = require('../schema/User');
const Profile = require('../schema/Profile')
const Comment = require('../schema/Comment')
const Liked = require('../schema/Liked')

const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const router = express.Router()

dotenv.config({ path: "../config.env" })

router.post("/", async (req, res) => {
    const { id_User, status, image } = req.body

    if (!id_User || !image) {
        return res.status(400).json({ err: 'Dont have enough properties' })
    }
    await Profile.findOne({ id_User: id_User }).then(async user => {
        if (!user) return res.status(400).json({ msg: 'Profile not found' })
        const newNewfeed = new Newfeed({ id_User, image, status })
        newNewfeed.save().then(async newfeed => {
            await Profile.findOne({ id_User: id_User }).then(async pfile => {
                await Profile.updateOne({ _id: pfile.id }, {
                    $set: {
                        "post": pfile.post + 1,
                    }
                })
                    .then(() => {
                        return res.status(200).json({ msg: 'Success', newfeed })
                    })
                    .catch(() => {
                        return res.status(400).json({ msg: 'Update post profile fail' })
                    })
            })
        })
    }).catch(err => { return res.status(400).json({ msg: 'Profile not found' }) })
})

router.get("/", async (req, res) => {
    const id_User = req.query.id_User
    await Newfeed.find({ id_User: id_User }).sort({ registration_data: -1 }).then(newfeed => {
        if (!newfeed)
            return res.status(200).json({ msg: 'Dont have newfeed' })
        return res.status(200).json({ msg: 'Success', newfeed })
    }).catch(error => { return res.status(400).send(error) })
})

router.get("/home", async (req, res) => {
    await Newfeed.aggregate([{
        $sample:{size:23}
    },{
        $group: {
            _id: "$_id",
            document: { $push: "$$ROOT" }
        }
    },{
        $limit:23
    }]).then(newfeed=>{
        if(!newfeed)
            return res.status(200).json({ msg: 'Dont have newfeed' })
        else
            return res.status(200).json({ msg: 'Success', newfeed })
    }).catch(error => { return res.status(400).send(error) })
})


router.get("/thispost", async (req, res) => {
    const id_Newfeed = req.query.id_Newfeed
    await Newfeed.findOne({ _id: id_Newfeed }).then(newfeed => {
        if (!newfeed)
            return res.status(200).json({ msg: 'Dont have newfeed' })
        return res.status(200).json({ msg: 'Success', newfeed })
    }).catch(error => { return res.status(400).send(error) })
})

router.post("/updatenewfeed", async (req, res) => {
    const { id, status, image } = req.body
    const newfeed = await Newfeed.updateOne({ _id: id }, {
        $set: {
            "status": status,
            "image": image,
            "registration_data": Date.now,
        }
    }).catch(error => {
        return res.status(400).json({ msg: 'Dont update newfeed user' })
    })
    if (!newfeed.nModified)
        return res.status(400).json({ msg: 'Dont update newfeed user', newfeed })
    return res.status(200).json({ msg: 'Update success', newfeed })
})

router.post("/deletenewfeed", async (req, res) => {
    const { id } = req.body
    let id_User
    await Newfeed.findOne({ _id: id }).then(newfeed => {
        if (newfeed) {
            id_User = newfeed.id_User
        }
        else
            return res.status(400).json({ msg: 'Dont find newfeed' })
    }).catch(er => {
        return res.status(400).json({ msg: 'Dont find newfeed' })
    })
    await Newfeed.deleteOne({ _id: id })
        .then(async (a) => {
            if (a.deletedCount == 1) {
                await Comment.deleteMany({ id_Newfeed: id })
                await Liked.deleteMany({ id_Newfeed: id })
                await Profile.findOne({ id_User: id_User }).then(async pfile => {
                    await Profile.updateOne({ _id: pfile.id }, {
                        $set: {
                            "post": pfile.post - 1,
                        }
                    })
                        .then(() => {
                            return res.status(200).json({ msg: 'Delete success' })
                        })
                }).catch(er => {
                    return
                })
            }
            else {
                return res.status(400).json({ msg: 'Dont delete newfeed user' })
            }
        })
        .catch(error => {
            return res.status(400).json({ msg: 'Dont delete newfeed user' })
        })
})

module.exports = router;