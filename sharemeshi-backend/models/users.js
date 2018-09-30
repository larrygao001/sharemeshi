const mongoose = require('mongoose');
// Users Schema
const UsersSchema = mongoose.Schema({
    name: {
        type: String
    },
    age: {
        type: Number
    },
    coordinates: {
        type: Object
    }
}, {collection: 'users'});

const Users = module.exports = mongoose.model('Users', UsersSchema);

function saveAll(data, callback) {
    let doc = data.pop();
    let udoc = new Users(doc);

    let total = data.length;

    udoc.save(function(err, saved){
        if (err) throw err;

        if (total > 0) saveAll(data, callback);
        else {
            console.log('saved all');
            callback();
        }
    })
}


module.exports.addUsers = function(param, callback) {

    console.log('model : ' + JSON.stringify(param));
    saveAll(param, callback);
}

module.exports.loadUsersByIndex = function(param, callback) {
    console.log("index : " + param.page);

    Users.find({}, callback)
         .skip((10 * (param.page + 1)) - 10)
         .limit(10);
}

module.exports.getUsersLen = function(param, callback) {
    Users.find({})
        .countDocuments(callback);
}
