const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const AllUsers = require('../models/all_users');
const AllUsersProvider = require('../providers/all_users_provider');

router.post('/add_users', (req, res, next) => {
    AllUsersProvider.addUsers(req.body, res);
});

module.exports = router;