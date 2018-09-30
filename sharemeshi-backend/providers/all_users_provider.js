const AllUsers = require('../models/all_users');
const cron = require("node-cron");
const globalConfig = require('../config/global');

const express = require('express');
const app = express();

module.exports.addUsers = function(newUsersData, res) {

    AllUsers.addUsers(newUsersData, (err, results) => {
        console.log('added');

        res.json({
            result: true,
            msg: "add users successfully"
        })
   });
   
}

