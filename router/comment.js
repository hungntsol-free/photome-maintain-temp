const express = require('express');
const Comment = require('../schema/Comment');
const Newfeed = require('../schema/Newfeed');
const User = require('../schema/User');

const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const router = express.Router()

dotenv.config({ path: "../config.env" })

router.post("/", async (req, res) => {
    const { id_User, id_Newfeed, comment } = req.body

    if (!id_User || !id_Newfeed || !comment) {
        return res.status(400).json({ err: 'Dont have enough properties' })
    }
    await User.findOne({ _id: id_User }).then(async user => {
        if (!user) return res.status(400).json({ msg: 'User not found' })
        else {
            await Newfeed.findOne({ _id: id_Newfeed }).then(newfeed => {
                if (!newfeed) return res.status(400).json({ msg: 'Newfeed not found' })
                else {
                    const newComment = new Comment({
                        id_User, id_Newfeed, comment,
                    })
                    newComment.save().then(async cmt => {
                        await Newfeed.updateOne({ _id: id_Newfeed }, {
                            $set: {
                                "comment": newfeed.comment + 1,
                                "id_impact": id_User.toString(),
                            }
                        })
                            .then(() => {
                                return res.status(200).json({ msg: 'Success', cmt })
                            })
                            .catch(async er => {
                                await Comment.deleteOne({ _id: cmt.id }).catch(error => {
                                    return res.status(400).json({ msg: 'Comment success but update newfeed' })
                                })
                                return res.status(400).json({ msg: 'Comment not found' })
                            })
                    }).catch(err => { return res.status(400).json({ msg: 'Comment not found' }) })
                }
            }).catch(err => { return res.status(400).json({ msg: 'Comment not found' }) })
        }
    }).catch(err => { return res.status(400).json({ msg: 'Comment not found' }) })
})

router.get("/", async (req, res) => {
    const { id_Newfeed } = req.query

    if (!id_Newfeed) {
        return res.status(400).json({ err: 'Dont have enough properties' })
    }
    await Comment.find({ "id_Newfeed": `${id_Newfeed}` }).sort({ registration_data: -1 }).then(comment => {
        if (!comment)
            return res.status(200).json({ msg: 'Comment dont have', comment })
        return res.status(200).json({ msg: 'Comment show', comment })
    }).catch(error => {
        return res.status(400).send(error)
    })
})

router.post("/deletecomment", async (req, res) => {
    const { id_User, id_Newfeed, id_Comment } = req.body

    if (!id_User || !id_Newfeed || !id_Comment) {
        return res.status(400).json({ msg: 'Dont have enough properties' })
    }
    const commented = await Comment.deleteOne({ _id: id_Comment })
        .then(async (a) => {
            if (a.deletedCount == 1) {
                await Newfeed.findOne({ _id: id_Newfeed }).then(async (newfeed) => {
                    if (newfeed) {
                        await Newfeed.updateOne({ _id: id_Newfeed }, {
                            $set: {
                                "comment": newfeed.comment - 1,
                            }
                        }).then((a) => {
                            return res.status(200).json({ msg: 'Delete success' })
                        }).catch(er => {
                            return res.status(400).json({ msg: 'Delete comment but dont update newfeed ' })
                        })
                    }
                    else {
                        return res.status(400).json({ msg: 'Dont have newfeed' })
                    }
                }).catch(er => {
                    return res.status(400).json({ msg: 'Delete comment but update newfeed' })
                })
            }
            else {
                return res.status(400).json({ msg: 'Dont have comment' })
            }
        })
        .catch(error => {
            return res.status(400).json({ msg: 'Dont delete comment user' })
        })
})
module.exports = router;