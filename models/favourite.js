const mongoose = require('mongoose');
const user = require('./user');
const Dishes = require('./dishes');
const Schema = mongoose.Schema;


const favouriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: Dishes
    }]
},{
     timestamps: true
});


var Favourites = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourites;

