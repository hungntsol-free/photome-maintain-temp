const express = require('express');
const Liked = require('../schema/Liked');
const Newfeed = require('../schema/Newfeed');
const User = require('../schema/User');

const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const router = express.Router()

dotenv.config({ path: "../config.env" })

router.post("/", async (req, res) => {
    const { id_User, id_Newfeed } = req.body

    if (!id_User || !id_Newfeed) {
        return res.status(400).json({ err: 'Dont have enough properties' })
    }
    await User.findOne({ _id: id_User }).then(async user => {
        if (!user) return res.status(400).json({ msg: 'User not found' })
        await Newfeed.findOne({ _id: id_Newfeed }).then(async newfeed => {
            if (!newfeed) return res.status(400).json({ msg: 'Newfeed not found' })
            await Liked.findOne({ id_User: id_User, id_Newfeed: id_Newfeed }).then(liked => {
                if (liked)
                    return res.status(200).json({ msg: 'Liked exist', liked })
                else {
                    const newLiked = new Liked({
                        id_User, id_Newfeed, liked: true,
                    })
                    newLiked.save().then(async liked => {
                        await Newfeed.updateOne({ _id: id_Newfeed }, {
                            $set: {
                                "like": newfeed.like + 1,
                                "id_impact": id_User.toString(),
                            }
                        })
                            .then(() => {
                                return res.status(200).json({ msg: 'Success', liked })
                            })
                            .catch(async er => {
                                await Liked.deleteOne({ _id: liked.id }).catch(error => {
                                    return res.status(400).json({ msg: 'Like success but update newfeed' })
                                })
                                return res.status(400).json({ msg: 'Like not found' })
                            })
                        return res.status(200).json({ msg: 'Success', liked })
                    })
                }
            }).catch(err => { return res.status(400).json({ msg: 'Liked not found' }) })
        }).catch(err => { return res.status(400).json({ msg: 'Liked not found' }) })
    }).catch(err => { return res.status(400).json({ msg: 'Liked not found' }) })
})

router.get("/", async (req, res) => {
    const { id_User, id_Newfeed } = req.query

    if (!id_User || !id_Newfeed) {
        return res.status(400).json({ err: 'Dont have enough properties' })
    }
    await Liked.findOne({ id_User: id_User, id_Newfeed: id_Newfeed }).then(liked => {
        if (!liked) return res.status(400).json({ msg: 'Liked not found' })
        return res.status(200).json({ msg: 'Get liked', liked })
    })
})

router.post("/updateliked", async (req, res) => {
    const { id_User, id_Newfeed } = req.body

    if (!id_User || !id_Newfeed) {
        return res.status(400).json({ err: 'Dont have enough properties' })
    }
    await Liked.findOne({ id_User: id_User, id_Newfeed: id_Newfeed }).then(async liked => {
        if (!liked) {
            await User.findOne({ _id: id_User }).then(async user => {
                if (!user) return res.status(400).json({ msg: 'User not found' })
                await Newfeed.findOne({ _id: id_Newfeed }).then(async newfeed => {
                    const newLiked = new Liked({
                        id_User, id_Newfeed, liked: true,
                    })
                    newLiked.save().then(async lik => {
                        await Newfeed.updateOne({ _id: id_Newfeed }, {
                            $set: {
                                "like": newfeed.like + 1,
                                "id_impact": id_User.toString(),
                            },
                            $push: {
                                "allIdReact": id_User
                            }
                        })
                            .then(() => {
                                return res.status(200).json({ msg: 'Like1 Success', id_Newfeed })
                            })
                            .catch(async er => {
                                await Liked.deleteOne({ _id: liked.id }).catch(error => {
                                    return res.status(400).json({ msg: 'Like success but update newfeed' })
                                })
                            })
                    }).catch(err => { return res.status(400).json({ msg: 'Liked not found' }) })
                }).catch(err => { return res.status(400).json({ msg: 'Liked not found' }) })
            }).catch(err => { return res.status(400).json({ msg: 'Liked not found' }) })
        }
        else {
            const likedse = await Liked.updateOne({ id_User: id_User, id_Newfeed: id_Newfeed }, {
                $set: {
                    "liked": !liked.liked,
                }
            }).catch(error => {
                return res.status(400).json({ msg: 'Dont update liked user' })
            })
            if (!likedse.nModified)
                return res.status(400).json({ msg: 'Dont update liked user', likedse })
            else {
                if (liked.liked) {
                    await Newfeed.findOne({ _id: id_Newfeed }).then(async (newfeed) => {
                        await Newfeed.updateOne({ _id: id_Newfeed }, {
                            $set: {
                                "like": newfeed.like - 1,
                            },
                            $pull: {
                                "allIdReact": id_User
                            }

                        })
                            .then(() => {
                                return res.status(200).json({ msg: 'Unlike success', id_Newfeed })
                            })
                            .catch(er => {
                                return res.status(400).json({ msg: 'Like not found' })
                            })
                    })
                }
                else {
                    await Newfeed.findOne({ _id: id_Newfeed }).then(async (newfeed) => {
                        await Newfeed.updateOne({ _id: id_Newfeed }, {
                            $set: {
                                "like": newfeed.like + 1,
                            },
                            $push: {
                                "allIdReact": id_User
                            }
                        })
                            .then(() => {
                                return res.status(200).json({ msg: 'Like2 success', id_Newfeed })
                            })
                            .catch(er => {
                                return res.status(400).json({ msg: 'Like not found' })
                            })
                    })
                }
            }
        }
    }).catch(error => {
        return res.status(400).json({ msg: 'Dont update liked user' })
    })
})

router.post("/deleteliked", async (req, res) => {
    const { id_User, id_Newfeed } = req.body

    if (!id_User || !id_Newfeed) {
        return res.status(400).json({ err: 'Dont have enough properties' })
    }
    await Liked.findOne({ id_User: id_User, id_Newfeed: id_Newfeed }).then(async liked => {
        if (liked) {
            const likedse = await Liked.deleteOne({ id_User: id_User, id_Newfeed: id_Newfeed }).catch(error => {
                return res.status(400).json({ msg: 'Dont delete liked user' })
            })
            if (!likedse.deletedCount)
                return res.status(400).json({ msg: 'Dont delete liked user', likedse })
            return res.status(200).json({ msg: 'Delete success', likedse })
        }
        else {
            return res.status(400).json({ msg: 'Dont have liked' })
        }
    }).catch(error => {
        return res.status(400).json({ msg: 'Dont delete liked user' })
    })
})
module.exports = router;