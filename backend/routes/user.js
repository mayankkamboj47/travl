const User = require('../models/User');
const router = require('express').Router();
const mongoose = require('mongoose');
const {authenticateToken, toSaltAndHash, validPassword } = require("../utils.js")
const jwt = require('jsonwebtoken');

// @route  POST /user/login
// @desc   Login a user
// @access Public
router.post('/login', async (req, res) => {
    // Check if username exists, if not return error
    const user = await User.findOne({username : req.body.username});
    if (!user) {
        return res.status(400).json({ message: 'Username or password is incorrect' });
    }
    // Check if password is correct, if not return error
    if (!validPassword(req.body.password, user.salt, user.hash)) {
        return res.status(400).json({ message: 'Username or password is incorrect' });
    }
    // Create and assign a token
    const token = jwt.sign({ id: user._id }, process.env.secretKey);
    res.json({ token: token });
});

// @route POST /user
// @desc  Create a new user
// @access Public
router.post('/', async (req, res) => {
    const properties = ['username', 'password', 'name', 'email', 'profilePic', 'bio', 'wishlist', 'visited', 'lists'];
    if (Object.keys(req.body).some(key => !properties.includes(key))) {
        return res.status(400).json({ message: 'Invalid property' });
    }
    if(req.body.password) {
        let {hash, salt} = await toSaltAndHash(req.body.password);
        delete req.body.password;
        req.body.salt = salt;
        req.body.hash = hash;
    }
    const user = new User({ ...req.body });
    try {
        const newUser = await user.save(); // it is saving even the users with invalid properties ! FIX IT
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    }
);


// @route  GET /user/id/:id
// @desc   Get a user by id
// @access Public
router.get('/id/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(user){
            delete user.hash;
            delete user.salt;
            res.json(user);
        }
        else{
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// @route  GET /user/:username
// @desc   Get a user by username
// @access Public
router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({username : req.params.username});
        if(user){
            delete user.hash;
            delete user.salt;
            res.json(user);
        }
        else{
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// @route  GET /user
// @desc   Get all users
// @access Public
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// @route  PATCH /user/:id
// @desc   Update a user by id
// @access Private
router.patch('/', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (req.body.username) {
            user.username = req.body.username;
        }
        if (req.body.password) {
            let {hash, salt} = await toSaltAndHash(req.body.password);
            user.salt = salt;
            user.hash = hash;
        }
        if (req.body.name) {
            user.name = req.body.name;
        }
        if (req.body.email) {
            user.email = req.body.email;
        }
        if (req.body.profilePic) {
            user.profilePic = req.body.profilePic;
        }
        if (req.body.bio) {
            user.bio = req.body.bio;
        }
        if (req.body.wishlist) {
            user.wishlist = req.body.wishlist;
        }
        if (req.body.visited) {
            user.visited = req.body.visited;
        }
        if (req.body.lists) {
            user.lists = req.body.lists;
        }
        const updatedUser = await user.save();
        res.json(updatedUser);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route  DELETE /user/:id
// @desc   Delete a user by id
// @access Private
router.delete('/', authenticateToken, async (req, res) => {
    try {
        await User.findOneAndDelete({_id : req.user.id});
        res.status(204).json({ message: 'User deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;