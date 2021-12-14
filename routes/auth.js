const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken")
var fetchUser = require("../middleware/fetchUser");

const JWT_SECRET = "eyJjoxNTE2MjM5MDIyfQ";

// ROUTE 1: CREATING USER WITH POST REQUEST AT : /api/auth/signup - No Login Required
router.post("/signup", [
    // Validation of Data
    body('name', 'Username must be atleast 3 characters long.').isLength({ min: 3 }),
    body('email', "Enter a valid email.").isEmail(),
    body('password', 'Password must be atleast 5 characters long.').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        // Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        user = await User.create({
            name: req.body.name,
            password: hashedpassword,
            email: req.body.email,
        });

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);

        // res.json(user)
        success = true;
        res.json({ success, authtoken })
        console.log(authtoken)

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error");
    }
})


// ROUTE 2: LOGIN WITH POST REQUEST WITH : /api/auth/login - Login Required
router.post("/login", [
    body('email', "Enter a valid email.").isEmail(),
    body('password', "Password cannot be empty").exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    // If errors return bad request with errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email })
        if (!user) {
            success = false
            res.status(400).send("Please try to login with correct credentials")
        }

        const finalPassword = await bcrypt.compare(password, user.password)
        if (!finalPassword) {
            success = false;
            res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }
        // JWT PROCCESS - AUTHTOKEN CREATION
        const data = {
            user: {
                id: user.id
            }
        }

        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true;
        res.json({ success, authtoken })
    } catch (error) {
        res.status(500).send("Internal Server Error or Runtime Error")
    }
})

// ROUTE 3 : FETCHING USER DETAILS USING POST REQUEST WITH : api/auth/user - Login Required
router.post("/user", fetchUser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        res.status(500).send("Internal Server Error or Runtime Error")
    }
})

module.exports = router