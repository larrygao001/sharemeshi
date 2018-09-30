const mongoose = require('mongoose');
// Users Schema
const AllUsersSchema = mongoose.Schema({
    name: {
        type: String
    },
    age: {
        type: Number
    },
    coordinates: {
        type: Object
    }
}, {collection: 'all_users'});

const AllUsers = module.exports = mongoose.model('AllUsers', AllUsersSchema);

function saveAll(data, callback) {
    let doc = data.pop();
    let udoc = new AllUsers(doc);

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
