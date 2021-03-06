const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/User');
const auth = require('../middleware/auth');

/**
 * @method - POST
 * @param - /user/signup
 * @description - User SignUp with a unique username and a unique email
 * @visibility - NOT LOGGED IN/SIGNED UP
 */

router.post(
    '/signup',
    [
        check('username', 'Please Enter a Valid Username').not().isEmpty(),
        check('email', 'Please enter a valid email').isEmail(),
        check('password', 'Please enter a valid password').isLength({
            min : 8
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors : errors.array(),
            });
        }

        const { username, email, password } = req.body;
        try {
            let user = await User.findOne({$or : [
                { username }, 
                { email }
            ]});
            if (user) {
                return res.status(400).json({
                    msg : 'User Already Exists',
                });
            }

            user = new User({
                username,
                email,
                password,
            })

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user : {
                    id : user.id,
                },
            };

            jwt.sign(
                payload,
                'randomString',
                {
                    expiresIn: 10000,
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token,
                    });
                }
            );
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Error in Saving');
        }
    }
);

/**
 * @method - POST
 * @param - /user/login
 * @description - User Login using username and password
 * @visibility - NOT LOGGED IN/SIGNED UP
 */

router.post(
    '/login',
    [
        check('username', 'Please Enter a Valid Username').not().isEmpty(),
        check('password', 'Please enter a valid password').isLength({
            min : 8,
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors : errors.array(),
            });
        }

        const { username, password } = req.body;
        try {
            let user = await User.findOne({
                username,
            });
            if (!user) {
                return res.status(400).json({
                    message : 'User Does Not Exist',
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    message : 'Incorrect Password',
                });
            }

            const payload = {
                user : {
                    id : user.id,
                },
            }

            jwt.sign(
                payload,
                'randomString',
                {
                    expiresIn : 3600,
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token,
                    });
                }
            );
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message : 'Server Error',
            });
        }
    }
);

/**
 * @method - GET
 * @param - /user/me
 * @description - Get LoggedIn User using token
 * @visibility - NOT LOGGED IN/SIGNED UP
 */

router.get(
    '/me', 
    auth, 
    async (req, res) => {
        try {
            // req.user is getting fetched from Middleware after token authentication
            const user = await User.findById(req.user.id);
            res.json(user);
        } catch (e) {
            res.send({ message : 'Error In Fetching User' });
        }
    }
);

/**
 * @method - DELETE
 * @param - /user/delete
 * @description - Delete User if they want to delete their account, must delete with token
 * @visibility - LOGGED IN
 */

router.delete(
    '/delete',
    auth,
    async (req, res) => {
        try {
            const deletedUser = await User.findByIdAndDelete(req.user.id);
            if (!deletedUser) {
                return res.status(400).json({
                    msg : 'Could not Find User to Delete',
                });
            }
            res.json(deletedUser);
        } catch (e) {
            res.send({ message : 'Error in Deleting User' });
        }
    }
);

/**
 * @method - PUT
 * @param - /user/password
 * @description - Change password, enter email as well as two new passwords
 * @visibility - LOGGED IN
 */

 router.put(
    '/password',
    [
        check('email', 'Please enter a valid email').isEmail(),
        check('pass1', 'Please enter valid passwords').isLength({
            min : 8,
        }),
        check('pass2', 'Please enter valid passwords').isLength({
            min : 8,
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors : errors.array(),
            });
        }

        const { email, pass1, pass2 } = req.body;
        try {
            if (pass1 === pass2) {
                const salt = await bcrypt.genSalt(10);
                newPassword = await bcrypt.hash(pass1, salt);

                userToChange = await User.findOneAndUpdate(
                    {
                        email,
                    }, 
                    {
                        password : newPassword,
                    },
                );

                res.send({ message : "Password Updated"});
            } else {
                return res.status(400).json({
                    msg : "Passwords Don't Match",
                });
            }
        } catch (e) {
            res.send({ message : 'Could not find user' });
        }
    }
);

/**
 * @method - GET
 * @param - /user/all
 * @description - testing purposes, seeing all accounts that are in our database
 * @visibility - ADMIN
 */
router.get("/all", function (req, res) {
    User.find().then((user_data) => {
        res.json({ result : user_data })
    });
});

module.exports = router;
