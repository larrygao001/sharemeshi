const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Users = require('../models/users');
const UsersProvider = require('../providers/users_provider');

router.post('/load_users_by_index', (req, res, next) => {
    UsersProvider.loadUsersByIndex(req.body, res);
});

router.post('/add_users', (req, res, next) => {
    UsersProvider.addUsers(req.body, res);
});

router.post('/get_users_len', (req, res, next) => {
    UsersProvider.getUsersLen(res);
});

module.exports = router;